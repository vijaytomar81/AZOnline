// src/tools/page-object-validator/validate/pipeline/types.ts

import type { Logger } from "@utils/logger";
import type { ValidationRuleResult } from "../types";

export type ValidationProfile =
    | "default"
    | "fast"
    | "full"
    | "strict";

export type ValidationContext = {
    mapsDir: string;
    pageObjectsDir: string;
    pageRegistryDir: string;
    manifestFile: string;
    verbose?: boolean;
    strict?: boolean;
    profile?: ValidationProfile;
    log: Logger;
};

export type ValidationRule = {
    id: string;
    description: string;
    run: (ctx: ValidationContext) => ValidationRuleResult | Promise<ValidationRuleResult>;
};