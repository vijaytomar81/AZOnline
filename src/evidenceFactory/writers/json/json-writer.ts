// src/evidenceFactory/writers/json/json-writer.ts
import path from 'path';
import { writeFile } from 'fs/promises';
import { ensureDir, getFileSize, relativeFromProject } from '../../utils/path-utils';
import { nowIso } from '../../utils/time-utils';
import { mapFields, resolveFields } from '../../utils/evidence-projector';
import type { ArtifactMetadata } from '../../contracts/types';

export class JsonWriter {
  async write(
    filePath: string,
    status: string,
    payload: Record<string, unknown>,
  ): Promise<ArtifactMetadata> {
    const json = mapFields(payload, resolveFields(status), 'json');

    await ensureDir(path.dirname(filePath));
    await writeFile(filePath, `${JSON.stringify(json, null, 2)}\n`, 'utf8');

    return {
      format: 'json',
      fileName: path.basename(filePath),
      filePath,
      relativePath: relativeFromProject(filePath),
      sizeBytes: await getFileSize(filePath),
      createdAt: nowIso(),
    };
  }
}
