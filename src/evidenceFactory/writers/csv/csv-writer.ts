// src/evidenceFactory/writers/csv/csv-writer.ts
import path from 'path';
import { writeFile } from 'fs/promises';
import { stringify } from 'csv-stringify/sync';
import {
  EVIDENCE_OUTPUT_FORMAT,
  type ArtifactMetadata,
  type ManifestItemEvent,
  type ManifestSummaryEvent,
} from '../../contracts/types';
import { ensureDir, getFileSize, relativeFromProject } from '../../utils/path-utils';
import { nowIso } from '../../utils/time-utils';
import { mapFields, resolveFields, resolveMetaFields } from '../../utils/evidence-projector';

export class CsvWriter {
  async writeConsolidated(
    filePath: string,
    items: ManifestItemEvent[],
    summary?: ManifestSummaryEvent,
  ): Promise<ArtifactMetadata> {
    const lines: string[] = [];

    if (summary) {
      lines.push('Summary');
      lines.push(
        stringify(
          Object.entries(
            mapFields(
              summary.metaPayload,
              resolveMetaFields(),
              EVIDENCE_OUTPUT_FORMAT.CSV,
            ),
          ).map(([field, value]) => ({ Field: field, Value: value })),
          { header: true },
        ).trimEnd(),
      );
      lines.push('');
    }

    for (const status of ['passed', 'failed', 'error', 'not_executed'] as const) {
      const rows = this.mapByStatus(items, status);
      if (rows.length === 0) continue;

      lines.push(status);
      lines.push(stringify(rows, { header: true }).trimEnd());
      lines.push('');
    }

    await ensureDir(path.dirname(filePath));
    await writeFile(filePath, `${lines.join('\n')}\n`, 'utf8');

    return {
      format: EVIDENCE_OUTPUT_FORMAT.CSV,
      fileName: path.basename(filePath),
      filePath,
      relativePath: relativeFromProject(filePath),
      sizeBytes: await getFileSize(filePath),
      createdAt: nowIso(),
    };
  }

  private mapByStatus(
    items: ManifestItemEvent[],
    status: string,
  ): Array<Record<string, string | number | boolean>> {
    const fields = resolveFields(status);
    return items
      .filter((item) => String(item.status).toLowerCase() === status)
      .map((item) =>
        mapFields(item.payload, fields, EVIDENCE_OUTPUT_FORMAT.CSV),
      );
  }
}
