// src/dataLayer/builder/cli/parseBoolean.ts

export function parseBoolean(value?: string): boolean {
    return ["true", "1", "yes", "y"].includes(
        String(value ?? "").toLowerCase()
    );
}