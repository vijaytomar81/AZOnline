// src/toolingLayer/pageObjects/generator/generator/reporting/countGenerationIssues.ts

import type { GenerationIssueCounts } from "./types";

export function countGenerationIssues(params: {
    invalidPages?: Array<unknown>;
    errorPages?: Array<unknown>;
}): GenerationIssueCounts {
    const invalidCount = params.invalidPages?.length ?? 0;
    const errorCount = params.errorPages?.length ?? 0;

    return {
        warnings: 0,
        errors: invalidCount + errorCount,
    };
}
