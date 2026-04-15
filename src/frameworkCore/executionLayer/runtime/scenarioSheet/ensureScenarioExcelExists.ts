// src/frameworkCore/executionLayer/runtime/scenarioSheet/ensureScenarioExcelExists.ts

import { AppError } from "@utils/errors";
import { fileExists } from "@utils/fs";

export function ensureScenarioExcelExists(
    absExcelPath: string,
    inputExcelPath: string
): void {
    if (fileExists(absExcelPath)) {
        return;
    }

    throw new AppError({
        code: "EXECUTION_SCENARIO_EXCEL_NOT_FOUND",
        stage: "load-scenario-sheet",
        source: "ensureScenarioExcelExists",
        message: `Execution Excel file not found: ${absExcelPath}`,
        context: {
            excelPath: inputExcelPath,
            absExcelPath,
        },
    });
}
