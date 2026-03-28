// src/execution/modes/e2e/scenario/template/validateE2EPipelineTemplateHeaders.ts

import { defaultE2EPipelineTemplateConfig } from "../e2EPipelineTemplateConfig";
import { missingHeaders } from "./missingHeaders";

export function validateE2EPipelineTemplateHeaders(
    headers: string[]
): string[] {
    const cfg = defaultE2EPipelineTemplateConfig;
    const requiredStep1Headers = cfg.stepFieldSuffixes.map(
        (suffix) => `Step1${suffix}`
    );

    return [
        ...missingHeaders(headers, cfg.requiredBaseHeaders),
        ...missingHeaders(headers, requiredStep1Headers),
    ].map((name) => `Missing required header: ${name}`);
}
