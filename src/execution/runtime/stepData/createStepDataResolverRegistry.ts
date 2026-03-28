// src/execution/runtime/stepData/createStepDataResolverRegistry.ts

import type { CasesFile } from "@data/builder/types";
import type { StepDataResolverRegistry } from "./types";

export function createStepDataResolverRegistry(): StepDataResolverRegistry {
    return {
        sources: [],
        cache: new Map<string, CasesFile>(),
    };
}
