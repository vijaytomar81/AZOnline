// src/evidenceFactory/writers/xml/xml-writer.ts
import path from 'path';
import { writeFile } from 'fs/promises';
import { XMLBuilder } from 'fast-xml-parser';
import { ensureDir, getFileSize, relativeFromProject } from '../../utils/path-utils';
import { nowIso } from '../../utils/time-utils';
import { mapXmlFields, resolveFields, resolveMetaFields, mapFields } from '../../utils/evidence-projector';
import type {
  ArtifactMetadata,
  ManifestItemEvent,
  ManifestSummaryEvent,
} from '../../contracts/types';

export class XmlWriter {
  private readonly builder = new XMLBuilder({ format: true, ignoreAttributes: false });

  async writeConsolidated(
    filePath: string,
    items: ManifestItemEvent[],
    summary?: ManifestSummaryEvent,
  ): Promise<ArtifactMetadata> {
    const xmlObject = {
      execution: {
        generatedAt: nowIso(),
        summary: summary
          ? mapFields(summary.metaPayload, resolveMetaFields(), 'xml')
          : undefined,
        passed: { item: this.mapByStatus(items, 'passed') },
        failed: { item: this.mapByStatus(items, 'failed') },
        error: { item: this.mapByStatus(items, 'error') },
        notExecuted: { item: this.mapByStatus(items, 'not_executed') },
      },
    };

    const xml = this.builder.build(xmlObject);
    await ensureDir(path.dirname(filePath));
    await writeFile(filePath, `${xml}\n`, 'utf8');

    return {
      format: 'xml',
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
      .map((item) => mapXmlFields(item.payload, fields));
  }
}