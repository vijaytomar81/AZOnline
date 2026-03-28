// src/execution/runtime/loadScenario/ensureScenarioExcelExists.ts

import { AppError } from "@utils/errors";
import { fileExists } from "@utils/fs";

export function ensureScenarioExcelExists(
    absExcel: string,
    excelPath: string
): void {
    if (!fileExists(absExcel)) {
        throw new AppError({
            code: "EXECUTION_EXCEL_NOT_FOUND",
            stage: "load-scenario-sheet",
            source: "loadScenarioSheet",
            message: `Execution Excel file not found: ${absExcel}`,
            context: {
                excelPath,
                absExcel,
            },
        });
    }
}
