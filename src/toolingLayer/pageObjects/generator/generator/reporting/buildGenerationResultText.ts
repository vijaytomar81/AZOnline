// src/toolingLayer/pageObjects/generator/generator/reporting/buildGenerationResultText.ts

import { failure, success, warning } from "@utils/cliFormat";
import type { GenerationResult } from "./types";

export function buildGenerationResultText(params: {
    warnings: number;
    errors: number;
}): GenerationResult {
    if (params.errors > 0) {
        return "ERROR";
    }

    if (params.warnings > 0) {
        return "WARN";
    }

    return "SUCCESS";
}

export function formatGenerationResultText(result: GenerationResult): string {
    if (result === "ERROR") {
        return failure("ERROR FOUND");
    }

    if (result === "WARN") {
        return warning("WARNING FOUND");
    }

    return success("ALL GOOD");
}
