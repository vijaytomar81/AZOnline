// src/pageObjectTools/page-object-repair/repair/pipeline/types.ts

import type { Logger } from "@utils/logger";
import type { RepairRuleResult } from "../types";

export type RepairContext = {
    mapsDir: string;
    pageObjectsDir: string;
    pageRegistryDir: string;
    manifestFile: string;
    verbose: boolean;
    log: Logger;
};

export type RepairRule = {
    id: string;
    description: string;
    run: (ctx: RepairContext) => Promise<RepairRuleResult> | RepairRuleResult;
};