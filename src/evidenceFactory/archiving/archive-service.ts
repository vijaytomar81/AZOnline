// src/evidenceFactory/archiving/archive-service.ts
import path from 'path';
import { readdir, rename, rm, stat } from 'fs/promises';
import { createWriteStream } from 'fs';
import archiver from 'archiver';
import { ensureDir, relativeFromProject } from '../utils/path-utils';
import { daysOld, monthBucket } from '../utils/time-utils';
import type {
  ArchiveExecutionEntry,
  ArchiveExecutionsResponse,
} from '../contracts/types';

export class ArchiveService {
  constructor(
    private readonly artifactsRoot = path.join(
      process.cwd(),
      process.env.EVIDENCE_ROOT_DIR ?? 'artifacts',
    ),
  ) { }

  async archiveOldExecutions(args: {
    olderThanDays?: number;
    zip?: boolean;
    maxCurrentExecutionsPerSuite?: number;
  }): Promise<ArchiveExecutionsResponse> {
    const currentRoot = path.join(this.artifactsRoot);
    const archivedExecutions: ArchiveExecutionEntry[] = [];

    for (const suite of await safeReadDir(currentRoot)) {
      if (suite === 'archive') {
        continue;
      }

      const suitePath = path.join(currentRoot, suite);
      const executions = await this.readExecutionDirs(suitePath);
      const sorted = executions.sort((a, b) => a.mtime.getTime() - b.mtime.getTime());

      for (const execution of sorted) {
        const shouldArchiveByAge =
          typeof args.olderThanDays === 'number' &&
          daysOld(execution.mtime) >= args.olderThanDays;

        if (!shouldArchiveByAge) {
          continue;
        }

        archivedExecutions.push(
          await this.archiveExecution(
            suite,
            execution.name,
            execution.fullPath,
            execution.mtime,
            !!args.zip,
          ),
        );
      }

      if (typeof args.maxCurrentExecutionsPerSuite === 'number') {
        const remaining = await this.readExecutionDirs(suitePath);
        const sortedRemaining = remaining.sort((a, b) => a.mtime.getTime() - b.mtime.getTime());

        while (sortedRemaining.length > args.maxCurrentExecutionsPerSuite) {
          const oldest = sortedRemaining.shift();

          if (!oldest) {
            break;
          }

          archivedExecutions.push(
            await this.archiveExecution(
              suite,
              oldest.name,
              oldest.fullPath,
              oldest.mtime,
              !!args.zip,
            ),
          );
        }
      }
    }

    return {
      archivedCount: archivedExecutions.length,
      archivedExecutions,
      message:
        archivedExecutions.length === 0
          ? 'No executions qualified for archiving.'
          : `Archived ${archivedExecutions.length} execution(s).`,
    };
  }

  private async archiveExecution(
    suiteName: string,
    executionId: string,
    executionPath: string,
    executionDate: Date,
    zip: boolean,
  ): Promise<ArchiveExecutionEntry> {
    const bucket = monthBucket(executionDate);
    const targetDir = path.join(this.artifactsRoot, 'archive', bucket, suiteName);
    await ensureDir(targetDir);

    if (zip) {
      const zipPath = path.join(targetDir, `${executionId}.zip`);
      await zipDirectory(executionPath, zipPath);
      await rm(executionPath, { recursive: true, force: true });

      return {
        suiteName,
        executionId,
        archivedPath: zipPath,
        archivedRelativePath: relativeFromProject(zipPath),
        zipped: true,
      };
    }

    const targetPath = path.join(targetDir, executionId);
    await rename(executionPath, targetPath);

    return {
      suiteName,
      executionId,
      archivedPath: targetPath,
      archivedRelativePath: relativeFromProject(targetPath),
      zipped: false,
    };
  }

  private async readExecutionDirs(
    suitePath: string,
  ): Promise<Array<{ name: string; fullPath: string; mtime: Date }>> {
    const result: Array<{ name: string; fullPath: string; mtime: Date }> = [];

    for (const entry of await safeReadDir(suitePath)) {
      const fullPath = path.join(suitePath, entry);

      try {
        const info = await stat(fullPath);

        if (info.isDirectory()) {
          result.push({
            name: entry,
            fullPath,
            mtime: info.mtime,
          });
        }
      } catch {
        // ignore
      }
    }

    return result;
  }
}

async function safeReadDir(dirPath: string): Promise<string[]> {
  try {
    return await readdir(dirPath);
  } catch {
    return [];
  }
}

async function zipDirectory(sourceDir: string, zipPath: string): Promise<void> {
  await ensureDir(path.dirname(zipPath));

  await new Promise<void>((resolve, reject) => {
    const output = createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => resolve());
    archive.on('error', (error) => reject(error));

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize().catch(reject);
  });
}