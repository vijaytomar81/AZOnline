// src/toolingLayer/businessJourneys/repair/repair/report.ts

import {
    failure,
    info,
    printCommandTitle,
    printEnvironment,
    printSummary,
    success,
    warning,
} from "@utils/cliFormat";
import {
    BUSINESS_JOURNEYS_DIR,
    PAGE_ACTIONS_REGISTRY_DIR,
    toRepoRelative,
} from "@utils/paths";
import type {
    RepairContext,
    RepairRuleResult,
    RepairStatus,
} from "../types";

function iconFor(status: RepairStatus): string {
    if (status === "failed") return failure("✖");
    if (status === "warning") return warning("⚠");
    if (status === "updated") return warning("↻");
    if (status === "created") return success("✔");
    if (status === "removed") return warning("−");
    return info("ℹ");
}

function summaryFor(result: RepairRuleResult): string {
    if (result.status === "failed") return failure(`${result.failed} failed`);
    if (result.status === "warning") return warning(`${result.warning} warning(s)`);
    if (result.status === "created") return success(`${result.filesCreated} file(s) created`);
    if (result.status === "updated") return warning(`${result.filesUpdated} file(s) updated`);
    if (result.status === "removed") return warning(`${result.filesRemoved} file(s) removed`);
    return info("no changes");
}

function printRule(result: RepairRuleResult): void {
    console.log(
        `${iconFor(result.status)} ${result.group} / ${result.name}  (${summaryFor(result)})`
    );

    result.details.forEach((detail, index) => {
        const branch = index === result.details.length - 1 ? "└─" : "├─";
        console.log(`   ${branch} ${detail.message}`);
    });
}

function sum(
    results: RepairRuleResult[],
    key: keyof Pick<
        RepairRuleResult,
        | "created"
        | "updated"
        | "removed"
        | "unchanged"
        | "warning"
        | "failed"
        | "filesCreated"
        | "filesUpdated"
        | "filesRemoved"
    >
): number {
    return results.reduce((total, item) => total + item[key], 0);
}

export function printRepairReport(args: {
    context: RepairContext;
    results: RepairRuleResult[];
}): void {
    printCommandTitle("BUSINESS JOURNEY REPAIR", "repairIcon");

    printEnvironment([
        ["businessJourneysDir", toRepoRelative(BUSINESS_JOURNEYS_DIR)],
        ["pageActionsRegistry", toRepoRelative(PAGE_ACTIONS_REGISTRY_DIR)],
        ["strict", args.context.strict],
        ["verbose", args.context.verbose],
    ]);

    console.log("");
    console.log("Repair execution");
    console.log("----------------");

    args.results.forEach(printRule);

    const created = sum(args.results, "created");
    const updated = sum(args.results, "updated");
    const removed = sum(args.results, "removed");
    const unchanged = sum(args.results, "unchanged");
    const warningCount = sum(args.results, "warning");
    const failed = sum(args.results, "failed");
    const filesCreated = sum(args.results, "filesCreated");
    const filesUpdated = sum(args.results, "filesUpdated");
    const filesRemoved = sum(args.results, "filesRemoved");

    const resultText =
        failed > 0
            ? failure("ATTENTION REQUIRED")
            : warningCount > 0 && (created > 0 || updated > 0 || removed > 0)
              ? warning("REPAIR APPLIED WITH WARNINGS")
              : created > 0 || updated > 0 || removed > 0
                ? success("REPAIR APPLIED")
                : warningCount > 0
                  ? warning("WARNINGS FOUND")
                  : info("NO CHANGES");

    printSummary(
        "REPAIR SUMMARY",
        [
            ["Rules run", args.results.length],
            ["Created", created],
            ["Updated", updated],
            ["Removed", removed],
            ["Unchanged", unchanged],
            ["Warning", warningCount],
            ["Failed", failed],
            ["Files created", filesCreated],
            ["Files updated", filesUpdated],
            ["Files removed", filesRemoved],
            ["Exit code", failed > 0 ? 1 : 0],
        ],
        resultText
    );
}
