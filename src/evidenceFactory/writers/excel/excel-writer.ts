// src/evidenceFactory/writers/excel/excel-writer.ts
import path from 'path';
import { writeFile } from 'fs/promises';
import ExcelJS from 'exceljs';
import { ensureDir, getFileSize, relativeFromProject } from '../../utils/path-utils';
import { nowIso } from '../../utils/time-utils';
import { mapFields, resolveFields, resolveMetaFields } from '../../utils/evidence-projector';
import { ExcelFormatter } from './excel-formatter';
import type { ArtifactMetadata, FinalizeExecutionRequest, ManifestEvent } from '../../contracts/types';

export class ExcelWriter {
  private readonly formatter = new ExcelFormatter();

  async write(
    filePath: string,
    request: FinalizeExecutionRequest,
    events: ManifestEvent[],
  ): Promise<ArtifactMetadata> {
    const workbook = new ExcelJS.Workbook();

    this.addSummary(workbook, request.metaPayload);
    this.addStatusSheet(workbook, 'Passed', 'passed', events.filter((event) => String(event.status).toLowerCase() === 'passed'));
    this.addStatusSheet(workbook, 'Failed', 'failed', events.filter((event) => String(event.status).toLowerCase() === 'failed'));
    this.addStatusSheet(workbook, 'Error', 'error', events.filter((event) => String(event.status).toLowerCase() === 'error'));
    this.addStatusSheet(workbook, 'Not Executed', 'not_executed', events.filter((event) => String(event.status).toLowerCase() === 'not_executed'));

    await ensureDir(path.dirname(filePath));
    const buffer = await workbook.xlsx.writeBuffer();
    await writeFile(filePath, Buffer.from(buffer));

    return {
      format: 'excel',
      fileName: path.basename(filePath),
      filePath,
      relativePath: relativeFromProject(filePath),
      sizeBytes: await getFileSize(filePath),
      createdAt: nowIso(),
    };
  }

  private addSummary(
    workbook: ExcelJS.Workbook,
    metaPayload: Record<string, unknown>,
  ): void {
    const sheet = workbook.addWorksheet('Summary');
    sheet.addRow(['Field', 'Value']);

    const mapped = mapFields(metaPayload, resolveMetaFields(), 'excel');
    for (const [field, value] of Object.entries(mapped)) {
      sheet.addRow([field, value]);
    }

    this.formatter.styleTable(sheet);
  }

  private addStatusSheet(
    workbook: ExcelJS.Workbook,
    title: string,
    status: string,
    events: ManifestEvent[],
  ): void {
    const sheet = workbook.addWorksheet(title);
    const fields = resolveFields(status).filter((field) => field.toBusinessOutput !== false);
    const headers = fields.map((field) => field.label);

    sheet.addRow(headers);

    for (const event of events) {
      const mapped = mapFields(event.payload, fields, 'excel');
      sheet.addRow(headers.map((header) => mapped[header] ?? ''));
    }

    this.formatter.styleTable(sheet);
  }
}