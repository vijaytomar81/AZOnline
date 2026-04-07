// src/tools/pageObjects/repair/repair/pipeline/runner.ts

import type {
    RepairRuleExecutionResult,
    RepairRunResult,
} from "../types";
import type { RepairContext } from "./types";
import { REPAIR_RULES } from "./registry";
import { buildRepairSummary, toExecutionResult } from "./helpers";

export async function runRepairPipeline(
    ctx: RepairContext
): Promise<RepairRunResult> {
    const perRule: RepairRuleExecutionResult[] = [];

    for (const rule of REPAIR_RULES) {
        const ruleLog = ctx.log.child(rule.id);

        if (ctx.verbose) {
            ruleLog.info(`Start: ${rule.description}`);
        }

        const result = await rule.run({
            ...ctx,
            log: ruleLog,
        });

        if (ctx.verbose) {
            ruleLog.info(
                `Completed: ${result.changedFiles} file(s), ${result.repairedPages} page(s)`
            );
        }

        perRule.push(toExecutionResult(rule, result));
    }

    return {
        perRule,
        summary: buildRepairSummary(perRule),
    };
}