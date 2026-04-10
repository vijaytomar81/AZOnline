// src/evidenceFactory/routing/output-router.ts
import path from 'path';
import { safeFileName, statusFolder } from '../utils/path-utils';
import { OutputFormat } from '../contracts/types';

export class OutputRouter {
  constructor(private readonly rootDir = path.join(process.cwd(), 'artifacts')) {}

  executionRoot(suiteName: string, executionId: string): string {
    return path.join(this.rootDir, 'current', safeFileName(suiteName), safeFileName(executionId));
  }

  eventFilePath(suiteName: string, executionId: string): string {
    return path.join(this.executionRoot(suiteName, executionId), 'manifests', 'events.ndjson');
  }

  evidenceFilePath(args: {
    suiteName: string;
    executionId: string;
    testCaseId: string;
    testName: string;
    status: string;
    format: Exclude<OutputFormat, 'console'>;
  }): string {
    const file = `${safeFileName(args.testCaseId)}_${safeFileName(args.testName)}.${args.format}`;
    return path.join(this.executionRoot(args.suiteName, args.executionId), args.format, statusFolder(args.status), file);
  }

  excelPath(suiteName: string, executionId: string): string {
    const file = `${safeFileName(suiteName)}_${safeFileName(executionId)}.xlsx`;
    return path.join(this.executionRoot(suiteName, executionId), 'excel', file);
  }
}
