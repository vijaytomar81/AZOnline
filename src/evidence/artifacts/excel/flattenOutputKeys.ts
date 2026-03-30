// src/evidence/artifacts/excel/flattenOutputKeys.ts

export type FlattenedOutputKey = {
    columnName: string;
    outputKey: string;
};

function getLeafKey(path: string): string {
    const parts = path.split(".");
    return parts[parts.length - 1] ?? path;
}

function toPascalCase(value: string): string {
    return value
        .replace(/[_\-.]+/g, " ")
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .split(" ")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");
}

export function flattenOutputKeys(
    input: unknown,
    result: FlattenedOutputKey[] = [],
): FlattenedOutputKey[] {
    if (!input || typeof input !== "object") {
        return result;
    }

    Object.values(input as Record<string, unknown>).forEach((value) => {
        if (typeof value === "string") {
            result.push({
                columnName: toPascalCase(getLeafKey(value)),
                outputKey: value,
            });
            return;
        }

        if (value && typeof value === "object" && !Array.isArray(value)) {
            flattenOutputKeys(value, result);
        }
    });

    return result;
}
