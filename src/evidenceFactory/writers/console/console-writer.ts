// src/evidenceFactory/writers/console/console-writer.ts
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

export class ConsoleWriter {
  async writeConsolidated(
    filePath: string,
    items: ManifestItemEvent[],
    summary?: ManifestSummaryEvent,
  ): Promise<ArtifactMetadata> {
    const lines: string[] = [];

    if (summary) {
      lines.push('[evidence][summary]');
      lines.push(
        JSON.stringify(
          mapFields(
            summary.metaPayload,
            resolveMetaFields(),
            EVIDENCE_OUTPUT_FORMAT.CONSOLE,
          ),
          null,
          2,
        ),
      );
      lines.push('');
    }

    for (const status of ['passed', 'failed', 'error', 'not_executed'] as const) {
      const rows = this.mapByStatus(items, status);
      if (rows.length === 0) continue;

      lines.push(`[evidence][${status}]`);
      lines.push(JSON.stringify(rows, null, 2));
      lines.push('');
    }

    const content = `${lines.join('\n')}\n`;
    console.log(content.trimEnd());

    await ensureDir(path.dirname(filePath));
    await writeFile(filePath, content, 'utf8');

    return {
      format: EVIDENCE_OUTPUT_FORMAT.CONSOLE,
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
        mapFields(item.payload, fields, EVIDENCE_OUTPUT_FORMAT.CONSOLE),
      );
  }
}
