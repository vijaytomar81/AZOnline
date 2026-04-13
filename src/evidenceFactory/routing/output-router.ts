// src/evidenceFactory/routing/output-router.ts
import path from 'path';
import { safeFileName } from '../utils/path-utils';
import { fileSafeTimestamp } from '../utils/time-utils';
import type { EvidenceOutputFormat } from '../contracts/types';

export class OutputRouter {
  constructor(
    private readonly rootDir = path.join(process.cwd(), process.env.EVIDENCE_ROOT_DIR ?? 'artifacts'),
    private readonly fileNaming?: {
      includeTimestamp?: boolean;
      timestampSource?: 'now' | 'payload';
    },
  ) { }

  executionRoot(suiteName: string, executionId: string): string {
    return path.join(
      this.rootDir,
      'current',
      safeFileName(suiteName),
      safeFileName(executionId),
    );
  }

  manifestDirPath(suiteName: string, executionId: string): string {
    return path.join(this.executionRoot(suiteName, executionId), 'manifests');
  }

  eventFilePath(suiteName: string, executionId: string, workerId: string): string {
    return path.join(this.manifestDirPath(suiteName, executionId), `${safeFileName(workerId)}.ndjson`);
  }

  finalOutputPath(args: {
    suiteName: string;
    executionId: string;
    format: EvidenceOutputFormat;
    payload?: Record<string, unknown>;
  }): string {
    const parts = [safeFileName(args.suiteName), safeFileName(args.executionId)];

    if (this.fileNaming?.includeTimestamp) {
      parts.push(this.resolveTimestamp(args.payload));
    }

    const extension = args.format === 'excel'
      ? 'xlsx'
      : args.format === 'console'
        ? 'log'
        : args.format;

    const file = `${parts.join('_')}.${extension}`;
    return path.join(this.executionRoot(args.suiteName, args.executionId), args.format, file);
  }

  currentSuiteRoot(suiteName: string): string {
    return path.join(this.rootDir, 'current', safeFileName(suiteName));
  }

  archiveSuiteRoot(bucket: string, suiteName: string): string {
    return path.join(this.rootDir, 'archive', bucket, safeFileName(suiteName));
  }

  private resolveTimestamp(payload?: Record<string, unknown>): string {
    if (this.fileNaming?.timestampSource === 'payload') {
      const candidate =
        payload?.artifactTimestamp ??
        payload?.finishedAt ??
        payload?.startedAt;

      if (candidate) {
        const parsed = new Date(String(candidate));
        if (!Number.isNaN(parsed.getTime())) {
          return fileSafeTimestamp(parsed);
        }
      }
    }

    return fileSafeTimestamp(new Date());
  }
}