// src/evidenceFactory/writers/excel/excel-writer.ts
import path from 'path';
import { writeFile } from 'fs/promises';
import ExcelJS from 'exceljs';
import { ensureDir, getFileSize, relativeFromProject } from '../../utils/path-utils';
import { nowIso } from '../../utils/time-utils';
import { mapFields, resolveFields, resolveMetaFields } from '../../utils/evidence-projector';
import { styleExecutionSheet, styleSummarySheet, type SummarySection } from './excel-formatter';
import type { ArtifactMetadata, FinalizeExecutionRequest, ManifestEvent } from '../../contracts/types';

type MetaField = {
  key: string;
  label: string;
  toReportOutput?: boolean;
};

export class ExcelWriter {
  async write(
    filePath: string,
    request: FinalizeExecutionRequest,
    events: ManifestEvent[],
  ): Promise<ArtifactMetadata> {
    const workbook = new ExcelJS.Workbook();

    this.addSummary(workbook, request.metaPayload);
    this.addStatusSheet(workbook, 'Passed', 'passed', this.filterByStatus(events, 'passed'));
    this.addStatusSheet(workbook, 'Failed', 'failed', this.filterByStatus(events, 'failed'));
    this.addStatusSheet(workbook, 'Error', 'error', this.filterByStatus(events, 'error'));
    this.addStatusSheet(
      workbook,
      'Not Executed',
      'not_executed',
      this.filterByStatus(events, 'not_executed'),
    );

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
    const metaFields = resolveMetaFields() as readonly MetaField[];
    const sections = this.buildSummarySections(metaPayload, metaFields);

    styleSummarySheet(sheet, sections);
  }

  private addStatusSheet(
    workbook: ExcelJS.Workbook,
    title: string,
    status: string,
    events: ManifestEvent[],
  ): void {
    const sheet = workbook.addWorksheet(title);
    const fields = resolveFields(status).filter((field) => field.toReportOutput !== false);
    const headers = fields.map((field) => field.label);

    sheet.addRow(headers);

    for (const event of events) {
      const mapped = mapFields(event.payload, fields, 'excel');
      sheet.addRow(headers.map((header) => mapped[header] ?? ''));
    }

    styleExecutionSheet(sheet, title);
  }

  private buildSummarySections(
    metaPayload: Record<string, unknown>,
    metaFields: readonly MetaField[],
  ): SummarySection[] {
    const sections: SummarySection[] = [];

    for (const [sectionKey, sectionValue] of Object.entries(metaPayload)) {
      if (!sectionValue || typeof sectionValue !== 'object' || Array.isArray(sectionValue)) {
        continue;
      }

      const sectionObject = sectionValue as Record<string, unknown>;
      const rows: SummarySection['rows'] = [];

      for (const [childKey, childValue] of Object.entries(sectionObject)) {
        const field = metaFields.find(
          (item) => item.key === childKey && item.toReportOutput !== false,
        );

        if (!field) {
          continue;
        }

        if (!this.hasDisplayableSummaryValue(childValue)) {
          continue;
        }

        rows.push({
          label: field.label,
          value: this.toCellValue(childValue),
        });
      }

      if (rows.length > 0) {
        sections.push({
          title: this.toSectionTitle(sectionKey),
          rows,
        });
      }
    }

    return sections;
  }

  private hasDisplayableSummaryValue(value: unknown): boolean {
    if (value === null || value === undefined) {
      return false;
    }

    if (typeof value === 'string') {
      return value.trim().length > 0;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return true;
    }

    if (value instanceof Date) {
      return true;
    }

    return false;
  }

  private filterByStatus(events: ManifestEvent[], status: string): ManifestEvent[] {
    return events.filter((event) => String(event.status).toLowerCase() === status);
  }

  private toSectionTitle(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  private toCellValue(value: unknown): string | number | boolean {
    if (value === null || value === undefined) {
      return '';
    }
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return value;
    }
    if (value instanceof Date) {
      return value.toISOString();
    }
    return JSON.stringify(value);
  }
}