// src/pageActionTools/page-action-validator/validate/pipeline/runner.ts

import type { ValidationPipelineArgs, ValidationPipelineResult } from "./types";

export function runValidationPipeline(
    args: ValidationPipelineArgs
): ValidationPipelineResult {
    const results = args.rules.map((rule) => {
        if (args.context.verbose) {
            console.log(
                `${new Date().toISOString()} [page-action-validator][validate:${rule.category}.${rule.name}] INFO: Start: ${rule.description}`
            );
        }

        const result = rule.run(args.context);

        if (args.context.verbose) {
            const issueCount = result.issues.length;
            const suffix =
                issueCount === 0
                    ? "Completed: no issues"
                    : `Completed: ${issueCount} issue(s)`;
            console.log(
                `${new Date().toISOString()} [page-action-validator][validate:${rule.category}.${rule.name}] INFO: ${suffix}`
            );
        }

        return result;
    });

    return {
        context: args.context,
        results,
    };
}
