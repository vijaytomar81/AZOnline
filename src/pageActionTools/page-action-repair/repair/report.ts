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
                ? "ISSUES FOUND"
                : appliedFixes > 0
                  ? "REPAIRED"
                  : "NO CHANGES",
    };
}

function buildFixDetailLines(args: {
    fix: RepairAppliedFix;
    fixIndex: number;
    fixCount: number;
    parentPrefix: string;
}): string[] {
    const lines: string[] = [];
    const key = args.fix.key ?? args.fix.message;
    const fixBranch = args.fixIndex === args.fixCount - 1 ? "└─" : "├─";
    const detailIndent = `${args.parentPrefix}${args.fixIndex === args.fixCount - 1 ? "   " : "│  "}`;

    lines.push(`${args.parentPrefix}${fixBranch} ${success(ICONS.successIcon)} ${key}`);

    if (args.fix.meta?.filePath) {
        lines.push(
            `${detailIndent}${muted("file".padEnd(23))}: ${args.fix.meta.filePath}`
        );
    }

    if (args.fix.meta?.incorrectValueFound !== undefined) {
        lines.push(
            `${detailIndent}${muted("incorrect value found".padEnd(23))}: ${failure(
                args.fix.meta.incorrectValueFound
            )}`
        );
    }

    if (args.fix.meta?.fixReplacedValue !== undefined) {
        lines.push(
            `${detailIndent}${muted("fix replaced value".padEnd(23))}: ${success(
                args.fix.meta.fixReplacedValue
            )}`
        );
    }

    lines.push(
        `${detailIndent}${muted("message".padEnd(23))}: ${args.fix.message}`
    );
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

        if (result.appliedFixes.length > 0) {
            const parentPrefix = index === results.length - 1 ? "   " : "│  ";

            result.appliedFixes.forEach((fix, fixIndex) => {
                lines.push(
                    ...buildFixDetailLines({
                        fix,
                        fixIndex,
                        fixCount: result.appliedFixes.length,
                        parentPrefix,
                    })
                );
            });
        }
    });

    return lines;
}

function buildColoredSummaryRows(summary: {
    rows: Array<[string, string | number]>;
}): Array<[string, string | number]> {
    return summary.rows.map(([label, value]) => {
        if (label === "Applied fixes") {
            return [label, Number(value) > 0 ? success(String(value)) : info(String(value))];
        }

        if (label === "Warnings") {
            return [label, Number(value) > 0 ? warning(String(value)) : info(String(value))];
        }

        if (label === "Errors") {
            return [label, Number(value) > 0 ? failure(String(value)) : info(String(value))];
        }

        if (label === "Rules run") {
            return [label, info(String(value))];
        }

        return [label, value];
    });
}

function buildColoredResultText(summary: {
    resultText: string;
}): string {
    if (summary.resultText === "REPAIRED") {
        return success(summary.resultText);
    }

    if (summary.resultText === "NO CHANGES") {
        return info(summary.resultText);
    }

    return failure(summary.resultText);
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

    printSummary(
        "REPAIR SUMMARY",
        buildColoredSummaryRows(summary),
        buildColoredResultText(summary)
    );

    return summary.exitCode;
}
