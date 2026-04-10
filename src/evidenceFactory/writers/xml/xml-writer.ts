// src/evidenceFactory/writers/xml/xml-writer.ts
import path from 'path';
import { writeFile } from 'fs/promises';
import { XMLBuilder } from 'fast-xml-parser';
import { ensureDir, getFileSize, relativeFromProject } from '../../utils/path-utils';
import { nowIso } from '../../utils/time-utils';
import { mapXmlFields, resolveFields } from '../../utils/evidence-projector';
import type { ArtifactMetadata } from '../../contracts/types';

export class XmlWriter {
  private readonly builder = new XMLBuilder({ format: true, ignoreAttributes: false });

  async write(
    filePath: string,
    status: string,
    payload: Record<string, unknown>,
  ): Promise<ArtifactMetadata> {
    const evidence = mapXmlFields(payload, resolveFields(status));
    const xml = this.builder.build({ evidence });

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
}
