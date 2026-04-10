// src/evidenceFactory/archiving/archive-service.ts
import path from 'path';
import { readdir, rename, stat } from 'fs/promises';
import { ensureDir } from '../utils/path-utils';
import { daysOld, monthBucket } from '../utils/time-utils';

export class ArchiveService {
  constructor(private readonly artifactsRoot = path.join(process.cwd(), 'artifacts')) {}

  async archiveOldExecutions(args: { olderThanDays: number }): Promise<{ archivedCount: number }> {
    const currentRoot = path.join(this.artifactsRoot, 'current');
    const archiveRoot = path.join(this.artifactsRoot, 'archive');
    let archivedCount = 0;

    for (const suite of await safeReadDir(currentRoot)) {
      const suitePath = path.join(currentRoot, suite);

      for (const executionId of await safeReadDir(suitePath)) {
        const executionPath = path.join(suitePath, executionId);
        const info = await stat(executionPath);

        if (!info.isDirectory() || daysOld(info.mtime) < args.olderThanDays) {
          continue;
        }

        const bucket = monthBucket(info.mtime);
        const targetDir = path.join(archiveRoot, bucket, suite);
        await ensureDir(targetDir);
        await rename(executionPath, path.join(targetDir, executionId));
        archivedCount += 1;
      }
    }

    return { archivedCount };
  }
}

async function safeReadDir(dirPath: string): Promise<string[]> {
  try {
    return await readdir(dirPath);
  } catch {
    return [];
  }
}
