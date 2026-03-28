// src/execution/modes/e2e/scenario/normalize/getTotalSteps.ts

import { defaultE2EPipelineTemplateConfig } from "../e2EPipelineTemplateConfig";
import { getScenarioString } from "./shared";

export function getTotalSteps(value: unknown): number {
    const num = Number(getScenarioString(value));

    if (!Number.isInteger(num) || num < 0) {
        return 0;
    }

    return Math.min(num, defaultE2EPipelineTemplateConfig.maxSteps);
}
