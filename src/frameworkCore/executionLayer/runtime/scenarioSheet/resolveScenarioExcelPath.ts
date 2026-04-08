// src/frameworkCore/executionLayer/runtime/scenarioSheet/resolveScenarioExcelPath.ts

import path from "node:path";

export function resolveScenarioExcelPath(excelPath: string): string {
    return path.isAbsolute(excelPath)
        ? excelPath
        : path.join(process.cwd(), excelPath);
}
