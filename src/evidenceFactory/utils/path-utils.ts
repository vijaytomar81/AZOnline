// src/evidenceFactory/utils/path-utils.ts
import path from 'path';
import { mkdir, stat } from 'fs/promises';

export async function ensureDir(dirPath: string): Promise<void> {
  await mkdir(dirPath, { recursive: true });
}

export async function getFileSize(filePath: string): Promise<number> {
  const fileStat = await stat(filePath);
  return fileStat.size;
}

export function safeFileName(value: string): string {
  return String(value)
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function statusFolder(status: string): string {
  return String(status).toLowerCase().replace(/_/g, '-');
}

export function relativeFromProject(filePath: string): string {
  return path.relative(process.cwd(), filePath);
}
