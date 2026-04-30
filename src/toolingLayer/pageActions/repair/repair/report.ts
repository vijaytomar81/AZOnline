// src/toolingLayer/pageActions/repair/repair/report.ts

import {
    printCommandTitle,
    printEnvironment,
    printSummary,
    success,
    warning,
    failure,
    info,
} from "@utils/cliFormat";
import {
    PAGE_ACTIONS_ACTIONS_DIR,
    PAGE_ACTIONS_DIR,
    PAGE_ACTIONS_MANIFEST_DIR,
    PAGE_MANIFEST_DIR,
    PAGE_ACTIONS_REGISTRY_DIR,
    toRepoRelative,
} from "@utils/paths";
import type {
    RepairContext,
    RepairRuleResult,
} from "../types";

function iconFor(status: RepairRuleResult["status"]): string {
    if (status === "failed") return failure("✖");
    if (status === "warning") return warning("⚠");
    if (status === "repaired") return success("✔");
    return info("ℹ");
}

function summaryFor(result: RepairRuleResult): string {
    if (result.status === "failed") {
        return failure(`${result.errors} error(s)`);
    }

    if (result.status === "warning") {
        return warning(`${result.warnings} warning(s)`);
    }

    if (result.status === "repaired") {
        return success(
            `${result.changedFiles} file(s), ${result.repairedItems} item(s) repaired`
        );
    }

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

export function printRepairReport(args: {
    context: RepairContext;
    results: RepairRuleResult[];
}): void {
    printCommandTitle("PAGE ACTION REPAIR", "repairIcon");

    printEnvironment([
        ["pageObjectsManifest", toRepoRelative(PAGE_MANIFEST_DIR)],
        ["pageActionsRoot", toRepoRelative(PAGE_ACTIONS_DIR)],
        ["pageActionsDir", toRepoRelative(PAGE_ACTIONS_ACTIONS_DIR)],
        ["manifestDir", toRepoRelative(PAGE_ACTIONS_MANIFEST_DIR)],
        ["registryDir", toRepoRelative(PAGE_ACTIONS_REGISTRY_DIR)],
        ["strict", args.context.strict],
        ["verbose", args.context.verbose],
    ]);

    console.log("");
    console.log("Repair execution");
    console.log("----------------");

    args.results.forEach(printRule);

    const changedFiles = args.results.reduce(
        (sum, item) => sum + item.changedFiles,
        0
    );
    const repairedItems = args.results.reduce(
        (sum, item) => sum + item.repairedItems,
        0
    );
    const failedRules = args.results.filter(
        (item) => item.status === "failed"
    ).length;
    const repairedRules = args.results.filter(
        (item) => item.status === "repaired"
    ).length;
    const unchangedRules = args.results.filter(
        (item) => item.status === "unchanged"
    ).length;
    const warningRules = args.results.filter(
        (item) => item.status === "warning"
    ).length;

    const resultText =
        failedRules > 0
            ? failure("INCOMPLETE")
            : repairedRules > 0
                ? success("REPAIR APPLIED")
                : info("NO CHANGES");

    printSummary(
        "REPAIR SUMMARY",
        [
            ["Rules run", args.results.length],
            ["Repaired rules", repairedRules],
            ["Unchanged rules", unchangedRules],
            ["Warning rules", warningRules],
            ["Failed rules", failedRules],
            ["Changed files", changedFiles],
            ["Repaired items", repairedItems],
            ["Exit code", failedRules > 0 ? 1 : 0],
        ],
        resultText
    );
}
