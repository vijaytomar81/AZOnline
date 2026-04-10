// src/evidenceFactory/manifest/ndjson-store.ts
import path from 'path';
import { appendFile, readFile } from 'fs/promises';
import { ensureDir } from '../utils/path-utils';
import type { ManifestEvent } from '../contracts/types';

export class NdjsonStore {
  async append(filePath: string, event: ManifestEvent): Promise<void> {
    await ensureDir(path.dirname(filePath));
    await appendFile(filePath, `${JSON.stringify(event)}\n`, 'utf8');
  }

  async readAll(filePath: string): Promise<ManifestEvent[]> {
    try {
      const content = await readFile(filePath, 'utf8');
      return content
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => JSON.parse(line) as ManifestEvent);
    } catch {
      return [];
    }
  }
}
