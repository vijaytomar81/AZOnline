// src/pageActionTools/page-action-repair/repair/pipeline/runner.ts

import type { RepairPipelineArgs, RepairPipelineResult } from "./types";

export function runRepairPipeline(args: RepairPipelineArgs): RepairPipelineResult {
    const results = args.rules.map((rule) => {
        if (args.context.verbose) {
            console.log(
                `${new Date().toISOString()} [page-action-repair][repair:${rule.category}.${rule.name}] INFO: Start: ${rule.description}`
            );
        }

        const result = rule.run(args.context);

        if (args.context.verbose) {
            const fixCount = result.appliedFixes.length;
            const suffix =
                fixCount === 0
                    ? "Completed: no fixes needed"
                    : `Completed: ${fixCount} fix(es) applied`;
            console.log(
                `${new Date().toISOString()} [page-action-repair][repair:${rule.category}.${rule.name}] INFO: ${suffix}`
            );
        }

        return result;
    });

    return {
        context: args.context,
        results,
    };
}
