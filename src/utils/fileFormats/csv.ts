// src/utils/fileFormats/csv.ts

import fs from "node:fs";

export function readCsvFile(filePath: string): string[][] {
    const content = fs.readFileSync(filePath, "utf-8");

    return content
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => line.split(",").map((cell) => cell.trim()));
}

export function writeCsvFile(
    filePath: string,
    rows: Array<Array<string | number>>
): void {
    const content = rows
        .map((row) => row.map((cell) => String(cell)).join(","))
        .join("\n");

    fs.writeFileSync(filePath, content, "utf-8");
}
