// src/execution/cli/runE2EModeFromCli.ts

import { AppError } from "@utils/errors";
import { runE2EMode } from "@execution/modes/e2e/runner";

export async function runE2EModeFromCli(args: {
    excelPath: string;
    sheetName: string;
    selectedIds: string[];
    includeDisabled: boolean;
    iterations: number;
    parallel: number;
    verbose: boolean;
}): Promise<void> {
    if (!args.excelPath) {
        throw new AppError({
            code: "EXECUTION_MISSING_EXCEL",
            stage: "cli-parse",
            source: "execution-index",
            message: "Missing --excel",
        });
    }

    if (!args.sheetName) {
        throw new AppError({
            code: "EXECUTION_MISSING_SHEET",
            stage: "cli-parse",
            source: "execution-index",
            message: "Missing --sheet",
        });
    }

    await runE2EMode({
        excelPath: args.excelPath,
        sheetName: args.sheetName,
        selectedIds: args.selectedIds,
        includeDisabled: args.includeDisabled,
        iterations: args.iterations,
        parallel: args.parallel,
        verbose: args.verbose,
    });
}
