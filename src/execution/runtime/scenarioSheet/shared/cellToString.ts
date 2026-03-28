// src/execution/runtime/scenarioSheet/shared/cellToString.ts

export function cellToString(value: unknown): string {
    if (value === null || value === undefined) {
        return "";
    }

    if (typeof value === "object") {
        const obj = value as Record<string, unknown>;

        if ("result" in obj) {
            return cellToString(obj.result);
        }

        if ("text" in obj) {
            return String(obj.text ?? "");
        }
    }

    return String(value);
}
