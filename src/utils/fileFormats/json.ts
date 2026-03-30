// src/utils/fileFormats/json.ts

import fs from "node:fs";

export function readJsonFile<T = unknown>(filePath: string): T {
    const content = fs.readFileSync(filePath, "utf-8");

    try {
        return JSON.parse(content) as T;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to parse JSON file: ${filePath}\n${message}`);
    }
}

export function writeJsonFile(
    filePath: string,
    data: unknown,
    pretty = true
): void {
    const json = pretty
        ? JSON.stringify(data, null, 2)
        : JSON.stringify(data);

    fs.writeFileSync(filePath, json, "utf-8");
}

export function updateJsonFile<T = unknown>(args: {
    filePath: string;
    updater: (data: T) => void;
    pretty?: boolean;
}): T {
    const data = readJsonFile<T>(args.filePath);

    args.updater(data);

    writeJsonFile(args.filePath, data, args.pretty ?? true);

    return data;
}

export function updateJsonValue<T>(
    data: T,
    updater: (draft: T) => void
): T {
    updater(data);
    return data;
}
