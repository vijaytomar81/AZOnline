// src/evidenceFactory/writers/json/json-writer.ts
import path from 'path';
import { writeFile } from 'fs/promises';
import { ensureDir, getFileSize, relativeFromProject } from '../../utils/path-utils';
import { nowIso } from '../../utils/time-utils';
import { mapFields, resolveFields, resolveMetaFields } from '../../utils/evidence-projector';
import type {
  ArtifactMetadata,
  ManifestItemEvent,
  ManifestSummaryEvent,
} from '../../contracts/types';

export class JsonWriter {
  async writeConsolidated(
    filePath: string,
    items: ManifestItemEvent[],
    summary?: ManifestSummaryEvent,
  ): Promise<ArtifactMetadata> {
    const grouped = {
      summary: summary
        ? mapFields(summary.metaPayload, resolveMetaFields(), 'json')
        : undefined,
      passed: this.mapByStatus(items, 'passed'),
      failed: this.mapByStatus(items, 'failed'),
      error: this.mapByStatus(items, 'error'),
      notExecuted: this.mapByStatus(items, 'not_executed'),
      generatedAt: nowIso(),
    };

    await ensureDir(path.dirname(filePath));
    await writeFile(filePath, `${JSON.stringify(grouped, null, 2)}\n`, 'utf8');

    return {
      format: 'json',
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
      .map((item) => mapFields(item.payload, fields, 'json'));
  }
}