// src/evidenceFactory/writers/xml/xml-writer.ts
import { XMLBuilder } from 'fast-xml-parser';
import { writeFile } from 'fs/promises';
import { ensureDir, getFileSize, relativeFromProject } from '../../utils/path-utils';
import { ArtifactMetadata, EvidenceSchema } from '../../contracts/types';
import { maskValue, toSerializableValue } from '../../utils/value-utils';
import { nowIso } from '../../utils/time-utils';

export class XmlWriter {
  private readonly builder = new XMLBuilder({ format: true, ignoreAttributes: false });

  async write<T extends Record<string, unknown>>(
    filePath: string,
    schema: EvidenceSchema<T>,
    data: T,
  ): Promise<ArtifactMetadata> {
    const evidence = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        toSerializableValue(maskValue(value, schema.fields[key as keyof T])),
      ]),
    );
    const xml = this.builder.build({ evidence });
    await ensureDir(filePath.substring(0, filePath.lastIndexOf('/')));
    await writeFile(filePath, `${xml}\n`, 'utf8');
    return {
      format: 'xml',
      fileName: filePath.split('/').pop(),
      filePath,
      relativePath: relativeFromProject(filePath),
      sizeBytes: await getFileSize(filePath),
      createdAt: nowIso(),
    };
  }
}
