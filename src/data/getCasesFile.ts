import fs from "node:fs";
import path from "node:path";
import type { CasesFile } from "./data-builder/types";

export function getCasesFile(sheetName: string): CasesFile {
    const filePath = path.join(
        process.cwd(),
        "src",
        "data",
        "generated",
        `${sheetName}.json`
    );

    if (!fs.existsSync(filePath)) {
        throw new Error(`❌ Test data JSON not found: ${filePath}`);
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as CasesFile;
}