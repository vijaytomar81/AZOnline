// src/evidenceFactory/utils/value-utils.ts
import { FieldDefinition } from '../contracts/types';

export function toSerializableValue(value: unknown): string | number | boolean {
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }
  if (value === null || value === undefined) {
    return '';
  }
  return JSON.stringify(value);
}

export function maskValue(value: unknown, field?: FieldDefinition): unknown {
  if (!field?.masked) {
    return value;
  }
  if (typeof value === 'string') {
    if (value.length <= 4) return '****';
    return `${value.slice(0, 2)}***${value.slice(-2)}`;
  }
  return '***';
}
