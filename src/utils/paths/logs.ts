// src/utils/paths/logs.ts

import path from "node:path";
import { ROOT } from "./core";

export const LOGS_DIR = ROOT;

export const PAGE_SCANNER_LOG_FILE = path.join(
    LOGS_DIR,
    "page-scanner.log"
);
export const PAGE_OBJECT_GENERATOR_LOG_FILE = path.join(
    LOGS_DIR,
    "page-object-generator.log"
);
export const PAGE_OBJECT_VALIDATOR_LOG_FILE = path.join(
    LOGS_DIR,
    "page-object-validator.log"
);
export const PAGE_OBJECT_REPAIR_LOG_FILE = path.join(
    LOGS_DIR,
    "page-object-repair.log"
);
export const DATA_BUILDER_LOG_FILE = path.join(
    LOGS_DIR,
    "data-builder.log"
);
