// src/pageActionTools/page-action-repair/repair/pipeline/types.ts

import type { RepairContext, RepairRule, RepairRuleResult } from "../types";

export type RepairPipelineArgs = {
    context: RepairContext;
    rules: RepairRule[];
};

export type RepairPipelineResult = {
    context: RepairContext;
    results: RepairRuleResult[];
};
