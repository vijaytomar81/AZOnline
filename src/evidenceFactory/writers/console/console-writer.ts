// src/evidenceFactory/writers/console/console-writer.ts
import { nowIso } from '../../utils/time-utils';
import { mapFields, resolveConsoleFields } from '../../utils/evidence-projector';
import type { ArtifactMetadata } from '../../contracts/types';

export class ConsoleWriter {
  write(payload: Record<string, unknown>, mode?: string): ArtifactMetadata {
    const fields = resolveConsoleFields(mode);
    console.log('[evidence][header]', mapFields(payload, fields.header, 'console'));
    console.log('[evidence][detail]', mapFields(payload, fields.detail, 'console'));

    return {
      format: 'console',
      createdAt: nowIso(),
    };
  }
}
