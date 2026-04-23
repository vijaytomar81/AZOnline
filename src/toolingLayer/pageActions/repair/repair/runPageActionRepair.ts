// src/toolingLayer/pageActions/repair/repair/runPageActionRepair.ts

import { runRepairRules } from "./runRepairRules";
import { printRepairReport } from "./report";
import type { RepairContext } from "../types";

export function runPageActionRepair(
    context: RepairContext
): void {
    const results = runRepairRules(context);

    printRepairReport({
        context,
        results,
    });

    const hasFailure = results.some(
        (item) => item.status === "failed"
    );

    process.exitCode = hasFailure ? 1 : 0;
}
