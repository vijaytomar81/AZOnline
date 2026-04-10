// src/evidenceFactory/writers/json/json-writer.ts
import { writeFile } from 'fs/promises';
import { ensureDir, getFileSize, relativeFromProject } from '../../utils/path-utils';
import { ArtifactMetadata, EvidenceSchema } from '../../contracts/types';
import { maskValue, toSerializableValue } from '../../utils/value-utils';
import { nowIso } from '../../utils/time-utils';

export class JsonWriter {
  async write<T extends Record<string, unknown>>(
    filePath: string,
    schema: EvidenceSchema<T>,
    data: T,
  ): Promise<ArtifactMetadata> {
    const json = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        toSerializableValue(maskValue(value, schema.fields[key as keyof T])),
      ]),
    );
    await ensureDir(filePath.substring(0, filePath.lastIndexOf('/')));
    await writeFile(filePath, `${JSON.stringify(json, null, 2)}\n`, 'utf8');
    return {
      format: 'json',
      fileName: filePath.split('/').pop(),
      filePath,
      relativePath: relativeFromProject(filePath),
      sizeBytes: await getFileSize(filePath),
      createdAt: nowIso(),
    };
  }
}
