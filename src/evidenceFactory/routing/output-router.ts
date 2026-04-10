// src/evidenceFactory/routing/output-router.ts
import path from 'path';
import { safeFileName, statusFolder } from '../utils/path-utils';
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

  eventFilePath(suiteName: string, executionId: string): string {
    return path.join(this.executionRoot(suiteName, executionId), 'manifests', 'events.ndjson');
  }

  evidenceFilePath(args: {
    suiteName: string;
    executionId: string;
    artifactId: string;
    artifactName?: string;
    status: string;
    format: Exclude<EvidenceOutputFormat, 'console'>;
    payload?: Record<string, unknown>;
  }): string {
    const parts = [safeFileName(args.artifactId)];

    if (args.artifactName) {
      parts.push(safeFileName(args.artifactName));
    }

    if (this.fileNaming?.includeTimestamp) {
      parts.push(this.resolveTimestamp(args.payload));
    }

    const file = `${parts.join('_')}.${args.format}`;

    return path.join(
      this.executionRoot(args.suiteName, args.executionId),
      args.format,
      statusFolder(args.status),
      file,
    );
  }

  excelPath(
    suiteName: string,
    executionId: string,
    payload?: Record<string, unknown>,
  ): string {
    const parts = [safeFileName(suiteName), safeFileName(executionId)];

    if (this.fileNaming?.includeTimestamp) {
      parts.push(this.resolveTimestamp(payload));
    }

    const file = `${parts.join('_')}.xlsx`;
    return path.join(this.executionRoot(suiteName, executionId), 'excel', file);
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