// src/evidenceFactory/manifest/ndjson-store.ts
import { appendFile, readFile } from 'fs/promises';
import { ensureDir } from '../utils/path-utils';
import { ManifestEvent } from '../contracts/types';

export class NdjsonStore {
  async append<T extends Record<string, unknown>>(
    filePath: string,
    event: ManifestEvent<T>,
  ): Promise<void> {
    await ensureDir(filePath.substring(0, filePath.lastIndexOf('/')));
    await appendFile(filePath, `${JSON.stringify(event)}\n`, 'utf8');
  }

  async readAll<T extends Record<string, unknown>>(filePath: string): Promise<Array<ManifestEvent<T>>> {
    try {
      const content = await readFile(filePath, 'utf8');
      return content
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => JSON.parse(line) as ManifestEvent<T>);
    } catch {
      return [];
    }
  }
}
