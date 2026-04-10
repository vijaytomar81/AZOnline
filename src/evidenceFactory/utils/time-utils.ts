// src/evidenceFactory/utils/time-utils.ts
export function nowIso(): string {
  return new Date().toISOString();
}

export function monthBucket(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function daysOld(target: Date): number {
  const diffMs = Date.now() - target.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}
