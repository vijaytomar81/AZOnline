// src/evidenceFactory/contracts/schema.ts
import { EvidenceSchema } from './types';

export function defineSchema<T extends Record<string, unknown>>(
  schema: EvidenceSchema<T>,
): EvidenceSchema<T> {
  return schema;
}
