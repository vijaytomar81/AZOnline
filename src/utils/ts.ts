// src/utils/ts.ts

/**
 * Convert a string like:
 *   "motor.car-details" => "MotorCarDetails"
 *   "car-details"       => "CarDetails"
 *   "car_details"       => "CarDetails"
 */
export function toPascal(s: string): string {
    return String(s ?? "")
        .replace(/[-_.]/g, " ")
        .split(" ")
        .filter(Boolean)
        .map((p) => p[0].toUpperCase() + p.slice(1))
        .join("");
}

/**
 * True if `key` is a valid TS identifier (variable name, exported const, etc.)
 */
export function isValidTsIdentifier(key: string): boolean {
    return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key);
}

/**
 * Escape a string for use inside a TypeScript double-quoted string literal.
 * (does NOT add the surrounding quotes)
 */
export function escapeTsString(s: string): string {
    return String(s ?? "")
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\r/g, "\\r")
        .replace(/\n/g, "\\n");
}