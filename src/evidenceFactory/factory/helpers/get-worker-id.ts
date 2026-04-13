// src/evidenceFactory/factory/helpers/get-worker-id.ts

export function getWorkerId(workerId?: string): string {
    const value = String(workerId ?? '').trim();
    return value.length > 0 ? value : '0';
}