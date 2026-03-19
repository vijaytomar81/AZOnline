// src/utils/env.ts

export function envString(name: string, defaultValue = ""): string {
    const value = process.env[name];
    return value === undefined ? defaultValue : String(value);
}

export function envBool(name: string, defaultValue = false): boolean {
    const value = process.env[name];
    if (value === undefined) return defaultValue;

    const normalized = String(value).trim().toLowerCase();

    if (["true", "1", "yes", "y", "on"].includes(normalized)) return true;
    if (["false", "0", "no", "n", "off"].includes(normalized)) return false;

    return defaultValue;
}

export function envNumber(name: string, defaultValue: number): number {
    const value = process.env[name];
    if (value === undefined) return defaultValue;

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : defaultValue;
}