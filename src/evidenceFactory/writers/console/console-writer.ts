// src/evidenceFactory/writers/console/console-writer.ts
import { ArtifactMetadata } from '../../contracts/types';
import { nowIso } from '../../utils/time-utils';

export class ConsoleWriter {
  write<T extends Record<string, unknown>>(context: { testCaseId: string; status: string; data: T }): ArtifactMetadata {
    console.log(`[evidence] ${context.testCaseId} ${context.status}`, context.data);
    return { format: 'console', createdAt: nowIso() };
  }
}
