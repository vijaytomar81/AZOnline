// src/evidenceFactory/writers/csv/csv-writer.ts
import path from 'path';
import { writeFile } from 'fs/promises';
import { stringify } from 'csv-stringify/sync';
import { ensureDir, getFileSize, relativeFromProject } from '../../utils/path-utils';
import { nowIso } from '../../utils/time-utils';
import { mapFields, resolveFields } from '../../utils/evidence-projector';
import type { ArtifactMetadata } from '../../contracts/types';

export class CsvWriter {
  async write(
    filePath: string,
    status: string,
    payload: Record<string, unknown>,
  ): Promise<ArtifactMetadata> {
    const row = mapFields(payload, resolveFields(status), 'csv');
    const csv = stringify([row], { header: true });

    await ensureDir(path.dirname(filePath));
    await writeFile(filePath, csv, 'utf8');

    return {
      format: 'csv',
      fileName: path.basename(filePath),
      filePath,
      relativePath: relativeFromProject(filePath),
      sizeBytes: await getFileSize(filePath),
      createdAt: nowIso(),
    };
  }
}