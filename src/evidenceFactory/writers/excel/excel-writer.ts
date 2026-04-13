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
  ManifestItemEvent,
  ManifestSummaryEvent,
} from '../../contracts/types';

type SummaryRow = SummarySection['rows'][number];

export class ExcelWriter {
  async writeConsolidated(
    filePath: string,
    items: ManifestItemEvent[],
    summary?: ManifestSummaryEvent,
  ): Promise<ArtifactMetadata> {
    const workbook = new ExcelJS.Workbook();

    if (summary) {
      const summarySections = this.buildSummarySections(
        summary.metaPayload,
        resolveMetaFields(),
      );

      if (summarySections.length > 0) {
        this.addSummary(workbook, summarySections);
      }
    }

    for (const [title, status] of [
      ['Passed', 'passed'],
      ['Failed', 'failed'],
      ['Error', 'error'],
      ['Not Executed', 'not_executed'],
    ] as const) {
      const statusItems = items.filter((item) => String(item.status).toLowerCase() === status);
      if (statusItems.length > 0) {
        this.addStatusSheet(workbook, title, status, statusItems);
      }
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

  private addSummary(workbook: ExcelJS.Workbook, sections: SummarySection[]): void {
    const sheet = workbook.addWorksheet('Summary');
    styleSummarySheet(sheet, sections);
  }

  private addStatusSheet(
    workbook: ExcelJS.Workbook,
    title: string,
    status: string,
    items: ManifestItemEvent[],
  ): void {
    const sheet = workbook.addWorksheet(title);
    const fields = resolveFields(status).filter((field) => field.toReportOutput !== false);
    const headers = fields.map((field) => field.label);

    sheet.addRow(headers);

    for (const item of items) {
      const mapped = mapFields(item.payload, fields, 'excel');
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
      if (field.toReportOutput === false) continue;

      const value = extractValue(metaPayload, field.key);
      if (!this.hasDisplayableSummaryValue(value)) continue;

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
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'number' || typeof value === 'boolean') return true;
    if (value instanceof Date) return true;
    return false;
  }
}