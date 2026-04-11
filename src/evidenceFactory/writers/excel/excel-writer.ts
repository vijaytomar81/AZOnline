// src/evidenceFactory/writers/excel/excel-writer.ts
import path from 'path';
import { writeFile } from 'fs/promises';
import ExcelJS from 'exceljs';
import {
  type MetaEvidenceViewField,
  type EvidenceReportSection,
} from '@configLayer/models/evidence';
import { ensureDir, getFileSize, relativeFromProject } from '../../utils/path-utils';
import { nowIso } from '../../utils/time-utils';
import {
  extractValue,
  mapFields,
  resolveFields,
  resolveMetaFields,
  toOutputValue,
} from '../../utils/evidence-projector';
import { styleExecutionSheet, styleSummarySheet, type SummarySection } from './excel-formatter';
import type {
  ArtifactMetadata,
  FinalizeExecutionRequest,
  ManifestEvent,
  ManifestItemEvent,
  ManifestSummaryEvent,
} from '../../contracts/types';

type SummaryRow = SummarySection['rows'][number];

export class ExcelWriter {
  async write(
    filePath: string,
    request: FinalizeExecutionRequest,
    events: ManifestEvent[],
  ): Promise<ArtifactMetadata> {
    const workbook = new ExcelJS.Workbook();

    const itemEvents = this.getItemEvents(events);
    const summaryEvent = this.getLatestSummaryEvent(events);

    if (summaryEvent) {
      const summarySections = this.buildSummarySections(
        summaryEvent.metaPayload,
        resolveMetaFields(),
      );

      if (summarySections.length > 0) {
        this.addSummary(workbook, summarySections);
      }
    }

    const passedEvents = this.filterByStatus(itemEvents, 'passed');
    if (passedEvents.length > 0) {
      this.addStatusSheet(workbook, 'Passed', 'passed', passedEvents);
    }

    const failedEvents = this.filterByStatus(itemEvents, 'failed');
    if (failedEvents.length > 0) {
      this.addStatusSheet(workbook, 'Failed', 'failed', failedEvents);
    }

    const errorEvents = this.filterByStatus(itemEvents, 'error');
    if (errorEvents.length > 0) {
      this.addStatusSheet(workbook, 'Error', 'error', errorEvents);
    }

    const notExecutedEvents = this.filterByStatus(itemEvents, 'not_executed');
    if (notExecutedEvents.length > 0) {
      this.addStatusSheet(workbook, 'Not Executed', 'not_executed', notExecutedEvents);
    }

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
    sections: SummarySection[],
  ): void {
    const sheet = workbook.addWorksheet('Summary');
    styleSummarySheet(sheet, sections);
  }

  private addStatusSheet(
    workbook: ExcelJS.Workbook,
    title: string,
    status: string,
    events: ManifestItemEvent[],
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
    metaFields: readonly MetaEvidenceViewField[],
  ): SummarySection[] {
    const sectionMap = new Map<EvidenceReportSection, SummaryRow[]>();

    for (const field of metaFields) {
      if (field.toReportOutput === false) {
        continue;
      }

      const value = extractValue(metaPayload, field.key);

      if (!this.hasDisplayableSummaryValue(value)) {
        continue;
      }

      const section = field.section ?? 'Other Info';

      if (!sectionMap.has(section)) {
        sectionMap.set(section, []);
      }

      sectionMap.get(section)!.push({
        key: field.key,
        label: field.label,
        value: toOutputValue(value),
      });
    }

    const orderedSections: EvidenceReportSection[] = [
      'Run',
      'Runtime',
      'Browser',
      'Results',
      'Timing',
      'System Metadata',
      'Other Info',
    ];

    return orderedSections
      .filter((section) => (sectionMap.get(section)?.length ?? 0) > 0)
      .map((section) => ({
        title: section,
        rows: sectionMap.get(section)!,
      }));
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

  private getItemEvents(events: ManifestEvent[]): ManifestItemEvent[] {
    return events.filter((event): event is ManifestItemEvent => event.eventType === 'item');
  }

  private getLatestSummaryEvent(events: ManifestEvent[]): ManifestSummaryEvent | undefined {
    const summaryEvents = events.filter(
      (event): event is ManifestSummaryEvent => event.eventType === 'summary',
    );

    if (summaryEvents.length === 0) {
      return undefined;
    }

    return summaryEvents[summaryEvents.length - 1];
  }

  private filterByStatus(events: ManifestItemEvent[], status: string): ManifestItemEvent[] {
    return events.filter((event) => String(event.status).toLowerCase() === status);
  }
}