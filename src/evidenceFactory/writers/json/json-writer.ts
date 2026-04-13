// src/evidenceFactory/writers/json/json-writer.ts
import path from 'path';
import { writeFile } from 'fs/promises';
import {
  EVIDENCE_OUTPUT_FORMAT,
  type ArtifactMetadata,
  type ManifestItemEvent,
  type ManifestSummaryEvent,
} from '../../contracts/types';
import { ensureDir, getFileSize, relativeFromProject } from '../../utils/path-utils';
import { nowIso } from '../../utils/time-utils';
import { mapFields, resolveFields, resolveMetaFields } from '../../utils/evidence-projector';

export class JsonWriter {
  async writeConsolidated(
    filePath: string,
    items: ManifestItemEvent[],
    summary?: ManifestSummaryEvent,
  ): Promise<ArtifactMetadata> {
    const grouped = {
      summary: summary
        ? mapFields(
            summary.metaPayload,
            resolveMetaFields(),
            EVIDENCE_OUTPUT_FORMAT.JSON,
          )
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
      format: EVIDENCE_OUTPUT_FORMAT.JSON,
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
        mapFields(item.payload, fields, EVIDENCE_OUTPUT_FORMAT.JSON),
      );
  }
}
