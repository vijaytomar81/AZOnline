// src/utils/regex.ts

/**
 * Escape a string to be used safely inside a RegExp constructor,
 * e.g. new RegExp(escapeForRegex(input), "i")
 */
export function escapeForRegex(s: string): string {
  return String(s ?? "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}