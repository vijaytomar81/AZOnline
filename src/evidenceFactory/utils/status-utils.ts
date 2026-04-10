// src/evidenceFactory/utils/status-utils.ts
import { EVIDENCE_STATUS } from '@configLayer/models/evidence/fields';

export function normalizeStatus(status: string): string {
  const lower = String(status).toLowerCase();

  if (lower === EVIDENCE_STATUS.PASSED || lower === 'passed') {
    return EVIDENCE_STATUS.PASSED;
  }

  if (lower === EVIDENCE_STATUS.FAILED || lower === 'failed') {
    return EVIDENCE_STATUS.FAILED;
  }

  if (lower === EVIDENCE_STATUS.ERROR || lower === 'error') {
    return EVIDENCE_STATUS.ERROR;
  }

  return EVIDENCE_STATUS.NOT_EXECUTED;
}
