// src/evidenceFactory/factory/validator.ts
import { EvidenceSchema } from '../contracts/types';

export function validateAgainstSchema<T extends Record<string, unknown>>(
  schema: EvidenceSchema<T>,
  data: T,
): void {
  for (const key of Object.keys(schema.fields) as Array<keyof T>) {
    const definition = schema.fields[key];
    const value = data[key];
    if (definition.required && (value === undefined || value === null || value === '')) {
      throw new Error(`Field ${String(key)} is required`);
    }
    if (value === undefined || value === null) {
      continue;
    }
    if (definition.type === 'date') {
      if (!(value instanceof Date) && Number.isNaN(Date.parse(String(value)))) {
        throw new Error(`Field ${String(key)} must be a valid date`);
      }
      continue;
    }
    if (typeof value !== definition.type) {
      throw new Error(`Field ${String(key)} must be ${definition.type}`);
    }
  }
}
