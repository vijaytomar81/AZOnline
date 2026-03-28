// src/execution/runtime/stepData/utils/buildStepDataCacheKey.ts

import type { StepDataSource } from "../types";
import { normalizeResolverKey } from "./normalizeResolverKey";

export function buildStepDataCacheKey(source: StepDataSource): string {
    return [
        normalizeResolverKey(source.action),
        normalizeResolverKey(source.schemaName),
        normalizeResolverKey(source.sheetName),
    ].join("|");
}
