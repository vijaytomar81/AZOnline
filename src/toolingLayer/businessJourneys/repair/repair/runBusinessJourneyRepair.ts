// src/toolingLayer/businessJourneys/repair/repair/runBusinessJourneyRepair.ts

import type { RepairContext } from "../types";
import { printRepairReport } from "./report";
import { runRepairRules } from "./runRepairRules";

export function runBusinessJourneyRepair(args: {
    strict?: boolean;
    verbose?: boolean;
} = {}): number {
    const context: RepairContext = {
        strict: !!args.strict,
        verbose: !!args.verbose,
    };

    const results = runRepairRules(context);
    printRepairReport({
        context,
        results,
    });

    return results.some((result) => result.failed > 0) ? 1 : 0;
}
