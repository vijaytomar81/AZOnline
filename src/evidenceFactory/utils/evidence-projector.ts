// src/evidenceFactory/utils/evidence-projector.ts
import {
  CONSOLE_EVIDENCE_FIELDS,
  ERROR_EVIDENCE_FIELDS,
  FAILED_EVIDENCE_FIELDS,
  META_EVIDENCE_FIELDS,
  NOT_EXECUTED_EVIDENCE_FIELDS,
  PASSED_EVIDENCE_FIELDS,
} from '@configLayer/models/evidence';
import type { EvidenceFieldDefinition } from '@configLayer/models/evidence/types';
import { normalizeStatus } from './status-utils';

type EvidenceViewField = EvidenceFieldDefinition & {
  toTechnicalOutput?: boolean;
  toBusinessOutput?: boolean;
};

export function resolveFields(status: string): readonly EvidenceViewField[] {
  switch (normalizeStatus(status)) {
    case 'passed':
      return PASSED_EVIDENCE_FIELDS;
    case 'failed':
      return FAILED_EVIDENCE_FIELDS;
    case 'error':
      return ERROR_EVIDENCE_FIELDS;
    default:
      return NOT_EXECUTED_EVIDENCE_FIELDS;
  }
}

export function resolveMetaFields(): readonly EvidenceViewField[] {
  return META_EVIDENCE_FIELDS;
}

export function resolveConsoleFields(mode?: string): {
  header: readonly EvidenceFieldDefinition[];
  detail: readonly EvidenceFieldDefinition[];
} {
  return String(mode ?? '').toLowerCase() === 'e2e'
    ? {
      header: CONSOLE_EVIDENCE_FIELDS.E2E_HEADER,
      detail: CONSOLE_EVIDENCE_FIELDS.E2E_ITEM,
    }
    : {
      header: CONSOLE_EVIDENCE_FIELDS.DATA_HEADER,
      detail: CONSOLE_EVIDENCE_FIELDS.DATA_DETAIL,
    };
}

export function mapFields(
  source: Record<string, unknown>,
  fields: readonly (EvidenceFieldDefinition & {
    toTechnicalOutput?: boolean;
    toBusinessOutput?: boolean;
  })[],
  target: 'json' | 'xml' | 'csv' | 'excel' | 'console',
): Record<string, string | number | boolean> {
  const result: Record<string, string | number | boolean> = {};

  for (const field of fields) {
    const include =
      target === 'excel' || target === 'console'
        ? field.toBusinessOutput !== false
        : field.toTechnicalOutput !== false;

    if (!include) {
      continue;
    }

    const value = extractValue(source, field.key);
    result[field.label] = toOutputValue(value);
  }

  return result;
}

export function mapXmlFields(
  source: Record<string, unknown>,
  fields: readonly (EvidenceFieldDefinition & {
    toTechnicalOutput?: boolean;
    toBusinessOutput?: boolean;
  })[],
): Record<string, string | number | boolean> {
  const result: Record<string, string | number | boolean> = {};

  for (const field of fields) {
    if (field.toTechnicalOutput === false) {
      continue;
    }

    const value = extractValue(source, field.key);
    result[toSafeXmlKey(field.field)] = toOutputValue(value);
  }

  return result;
}

function extractValue(source: Record<string, unknown>, keyPath: string): unknown {
  if (!keyPath.includes('.')) {
    return source[keyPath];
  }

  return keyPath.split('.').reduce<unknown>((current, key) => {
    if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, source);
}

function toOutputValue(value: unknown): string | number | boolean {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return JSON.stringify(value);
}

function toSafeXmlKey(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, '_');
}