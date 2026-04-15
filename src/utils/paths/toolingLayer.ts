// src/utils/paths/toolingLayer.ts

import path from "node:path";
import { TOOLING_LAYER_DIR } from "./core";

export const PAGE_SCANNER_DIR = path.join(TOOLING_LAYER_DIR, "pageScanner");

export const PAGE_OBJECT_TOOLS_DIR = path.join(
    TOOLING_LAYER_DIR,
    "pageObjects"
);
export const PAGE_OBJECT_COMMON_DIR = path.join(
    PAGE_OBJECT_TOOLS_DIR,
    "common"
);
export const PAGE_OBJECT_GENERATOR_DIR = path.join(
    PAGE_OBJECT_TOOLS_DIR,
    "generator"
);
export const PAGE_OBJECT_VALIDATOR_DIR = path.join(
    PAGE_OBJECT_TOOLS_DIR,
    "validator"
);
export const PAGE_OBJECT_REPAIR_DIR = path.join(
    PAGE_OBJECT_TOOLS_DIR,
    "repair"
);

export const PAGE_ACTION_TOOLS_DIR = path.join(
    TOOLING_LAYER_DIR,
    "pageActions"
);
export const PAGE_ACTION_GENERATOR_DIR = path.join(
    PAGE_ACTION_TOOLS_DIR,
    "generator"
);

export const BUSINESS_JOURNEY_TOOLS_DIR = path.join(
    TOOLING_LAYER_DIR,
    "businessJourneys"
);
export const BUSINESS_JOURNEY_GENERATOR_DIR = path.join(
    BUSINESS_JOURNEY_TOOLS_DIR,
    "generator"
);

export const QUALITY_TOOLS_DIR = path.join(TOOLING_LAYER_DIR, "quality");
export const FILE_HEADER_CHECKER_DIR = path.join(
    QUALITY_TOOLS_DIR,
    "fileHeaderChecker"
);

export const SHARED_TOOLS_DIR = path.join(TOOLING_LAYER_DIR, "shared");
