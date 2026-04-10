// src/evidenceFactory/writers/excel/excel-writer.ts
import ExcelJS from 'exceljs';
import { writeFile } from 'fs/promises';
import { ArtifactMetadata, ManifestEvent } from '../../contracts/types';
import { ensureDir, getFileSize, relativeFromProject } from '../../utils/path-utils';
import { nowIso } from '../../utils/time-utils';
import { ExcelFormatter } from './excel-formatter';

export class ExcelWriter {
  private readonly formatter = new ExcelFormatter();

  async write<T extends Record<string, unknown>>(
    filePath: string,
    request: { executionId: string; suiteName: string; appName: string; environment: string },
    events: Array<ManifestEvent<T>>,
  ): Promise<ArtifactMetadata> {
    const workbook = new ExcelJS.Workbook();
    this.addSummary(workbook, request, events);
    this.addStatusSheet(workbook, 'Passed', events.filter((e) => e.status === 'PASSED'));
    this.addStatusSheet(workbook, 'Failed', events.filter((e) => e.status === 'FAILED'));
    this.addStatusSheet(workbook, 'Error', events.filter((e) => e.status === 'ERROR'));
    this.addStatusSheet(workbook, 'Not Executed', events.filter((e) => e.status === 'NOT_EXECUTED'));
    await ensureDir(filePath.substring(0, filePath.lastIndexOf('/')));
    const buffer = await workbook.xlsx.writeBuffer();
    await writeFile(filePath, Buffer.from(buffer));
    return {
      format: 'excel',
      fileName: filePath.split('/').pop(),
      filePath,
      relativePath: relativeFromProject(filePath),
      sizeBytes: await getFileSize(filePath),
      createdAt: nowIso(),
    };
  }

  private addSummary<T extends Record<string, unknown>>(
    workbook: ExcelJS.Workbook,
    request: { executionId: string; suiteName: string; appName: string; environment: string },
    events: Array<ManifestEvent<T>>,
  ): void {
    const summary = workbook.addWorksheet('Summary');
    const counts = {
      total: events.length,
      passed: events.filter((e) => e.status === 'PASSED').length,
      failed: events.filter((e) => e.status === 'FAILED').length,
      error: events.filter((e) => e.status === 'ERROR').length,
      notExecuted: events.filter((e) => e.status === 'NOT_EXECUTED').length,
    };
    summary.addRows([
      ['Execution Id', request.executionId],
      ['Suite Name', request.suiteName],
      ['App Name', request.appName],
      ['Environment', request.environment],
      ['Generated At', nowIso()],
      [],
      ['Metric', 'Count'],
      ['Total', counts.total],
      ['Passed', counts.passed],
      ['Failed', counts.failed],
      ['Error', counts.error],
      ['Not Executed', counts.notExecuted],
    ]);
    this.formatter.styleHeader(summary.getRow(7));
    summary.columns.forEach((column) => (column.width = 22));
  }

  private addStatusSheet<T extends Record<string, unknown>>(
    workbook: ExcelJS.Workbook,
    name: string,
    events: Array<ManifestEvent<T>>,
  ): void {
    const sheet = workbook.addWorksheet(name);
    sheet.addRow([
      'testCaseId', 'testName', 'status', 'insuranceType', 'startedAt', 'endedAt', 'durationMs',
      'correlationId', 'traceId', 'failureReason', 'errorMessage', 'jsonPath', 'xmlPath', 'csvPath',
    ]);
    for (const event of events) {
      sheet.addRow([
        event.testCaseId, event.testName, event.status, event.insuranceType, event.startedAt,
        event.endedAt, event.durationMs, event.correlationId ?? '', event.traceId ?? '',
        event.failureReason ?? '', event.errorMessage ?? '', event.jsonPath ?? '',
        event.xmlPath ?? '', event.csvPath ?? '',
      ]);
    }
    this.formatter.styleTable(sheet);
  }
}
