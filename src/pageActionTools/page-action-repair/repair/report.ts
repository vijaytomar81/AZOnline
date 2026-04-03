// src/pageActionTools/page-action-repair/repair/report.ts

import {
    failure,
    info,
    muted,
    printCommandTitle,
    printEnvironment,
    printSummary,
    success,
    warning,
} from "@utils/cliFormat";
import { ICONS } from "@utils/icons";
import {
    PAGE_ACTIONS_ACTIONS_DIR,
    PAGE_ACTIONS_MANIFEST_DIR,
    PAGE_MANIFEST_DIR,
} from "@utils/paths";
import { getPageActionRepairRules } from "./pipeline/registry";
import { runRepairPipeline } from "./pipeline/runner";
import type { RepairAppliedFix, RepairContext, RepairRuleResult } from "./types";

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
        resultText:
            errors > 0
                ? failure("ISSUES FOUND")
                : appliedFixes > 0
                  ? success("REPAIRED")
                  : info("NO CHANGES"),
    };
}

function buildFixDetailLines(fix: RepairAppliedFix): string[] {
    const lines: string[] = [];
    const key = fix.key ?? fix.message;

    lines.push(`   ${success(ICONS.successIcon)} ${key}`);

    if (fix.meta?.filePath) {
        lines.push(`     ${muted("file".padEnd(21))}: ${fix.meta.filePath}`);
    }

    if (fix.meta?.incorrectValueFound !== undefined) {
        lines.push(
            `     ${muted("incorrect value".padEnd(21))}: ${failure(fix.meta.incorrectValueFound)}`
        );
    }

    if (fix.meta?.fixReplacedValue !== undefined) {
        lines.push(
            `     ${muted("fixed value".padEnd(21))}: ${success(fix.meta.fixReplacedValue)}`
        );
    }

    lines.push(`     ${muted("message".padEnd(21))}: ${fix.message}`);
    lines.push("");

    return lines;
}

function buildRepairSuffix(result: RepairRuleResult): string {
    if (result.appliedFixes.length > 0) {
        return success(`(${result.appliedFixes.length} fix(es) applied)`);
    }

    if (result.issues.some((x) => x.level === "error")) {
        const count = result.issues.filter((x) => x.level === "error").length;
        return failure(`(${count} error(s))`);
    }

    if (result.issues.some((x) => x.level === "warning")) {
        const count = result.issues.filter((x) => x.level === "warning").length;
        return warning(`(${count} warning(s))`);
    }

    return info("(no fixes needed)");
}

function buildRepairExecutionLines(
    results: RepairRuleResult[],
    verbose: boolean
): string[] {
    const lines = ["Repair execution", "----------------"];

    results.forEach((result, index) => {
        const branch = index === results.length - 1 ? "└─" : "├─";
        const icon =
            result.appliedFixes.length > 0
                ? success(ICONS.successIcon)
                : result.issues.some((x) => x.level === "error")
                  ? failure(ICONS.failIcon)
                  : result.issues.some((x) => x.level === "warning")
                    ? warning(ICONS.warningIcon)
                    : info("ℹ");

        lines.push(
            `${branch} ${icon} ${result.category}.${result.name}  ${buildRepairSuffix(result)}`
        );

        if (verbose && result.appliedFixes.length > 0) {
            result.appliedFixes.forEach((fix) => {
                lines.push(...buildFixDetailLines(fix));
            });
        }
    });

    return lines;
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

    buildRepairExecutionLines(pipeline.results, args.verbose).forEach((line) =>
        console.log(line)
    );

    const summary = summarize(pipeline.results);

    printSummary("REPAIR SUMMARY", summary.rows, summary.resultText);

    return summary.exitCode;
}
