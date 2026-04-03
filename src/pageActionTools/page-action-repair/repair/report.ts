// src/pageActionTools/page-action-repair/repair/report.ts

import {
    printCommandTitle,
    printEnvironment,
    printSummary,
} from "@utils/cliFormat";
import {
    PAGE_ACTIONS_ACTIONS_DIR,
    PAGE_ACTIONS_MANIFEST_DIR,
    PAGE_MANIFEST_DIR,
} from "@utils/paths";
import { getPageActionRepairRules } from "./pipeline/registry";
import { runRepairPipeline } from "./pipeline/runner";
import type { RepairContext } from "./types";

function createContext(verbose: boolean): RepairContext {
    return { verbose };
}

function summarize(results: ReturnType<typeof runRepairPipeline>["results"]) {
    const rulesRun = results.length;
    const appliedFixes = results.reduce((sum, x) => sum + x.appliedFixes.length, 0);
    const warnings = results.reduce(
        (sum, x) => sum + x.issues.filter((y) => y.level === "warning").length,
        0
    );
    const errors = results.reduce(
        (sum, x) => sum + x.issues.filter((y) => y.level === "error").length,
        0
    );

    return {
        rows: [
            ["Rules run", rulesRun],
            ["Applied fixes", appliedFixes],
            ["Warnings", warnings],
            ["Errors", errors],
        ] as Array<[string, string | number]>,
        exitCode: errors > 0 ? 1 : 0,
        resultText: errors > 0 ? "ISSUES FOUND" : appliedFixes > 0 ? "REPAIRED" : "NO CHANGES",
    };
}

export function runPageActionRepair(args: { verbose: boolean }): number {
    printCommandTitle("PAGE ACTION REPAIR", "repairIcon");
    printEnvironment([
        ["pageObjectsManifest", PAGE_MANIFEST_DIR],
        ["pageActionsDir", PAGE_ACTIONS_ACTIONS_DIR],
        ["manifestDir", PAGE_ACTIONS_MANIFEST_DIR],
        ["verbose", args.verbose],
    ]);

    const pipeline = runRepairPipeline({
        context: createContext(args.verbose),
        rules: getPageActionRepairRules(),
    });

    console.log("Repair execution");
    console.log("----------------");
    pipeline.results.forEach((result) => {
        const prefix =
            result.appliedFixes.length > 0 ? "✔" :
            result.issues.some((x) => x.level === "error") ? "✖" : "ℹ";
        const suffix =
            result.appliedFixes.length > 0
                ? `${result.appliedFixes.length} fix(es) applied`
                : "no fixes needed";
        console.log(`${prefix} ${result.category}.${result.name}  (${suffix})`);
    });

    const summary = summarize(pipeline.results);
    printSummary("REPAIR SUMMARY", summary.rows, summary.resultText);
    return summary.exitCode;
}
