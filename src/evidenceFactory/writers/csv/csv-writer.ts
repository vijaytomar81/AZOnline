// src/evidenceFactory/writers/csv/csv-writer.ts
import { stringify } from 'csv-stringify/sync';
import { writeFile } from 'fs/promises';
import { ensureDir, getFileSize, relativeFromProject } from '../../utils/path-utils';
import { ArtifactMetadata, EvidenceSchema } from '../../contracts/types';
import { maskValue, toSerializableValue } from '../../utils/value-utils';
import { nowIso } from '../../utils/time-utils';

export class CsvWriter {
  async write<T extends Record<string, unknown>>(
    filePath: string,
    schema: EvidenceSchema<T>,
    data: T,
  ): Promise<ArtifactMetadata> {
    const row = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        toSerializableValue(maskValue(value, schema.fields[key as keyof T])),
      ]),
    );
    const csv = stringify([row], { header: true });
    await ensureDir(filePath.substring(0, filePath.lastIndexOf('/')));
    await writeFile(filePath, csv, 'utf8');
    return {
      format: 'csv',
      fileName: filePath.split('/').pop(),
      filePath,
      relativePath: relativeFromProject(filePath),
      sizeBytes: await getFileSize(filePath),
      createdAt: nowIso(),
    };
  }
}
