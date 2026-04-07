// src/utils/paths/frameworkCore.ts

import path from "node:path";
import { FRAMEWORK_CORE_DIR } from "./core";

export const AUTOMATION_DIR = path.join(FRAMEWORK_CORE_DIR, "automation");
export const AUTOMATION_BASE_DIR = path.join(AUTOMATION_DIR, "base");
export const AUTOMATION_DIAGNOSTICS_DIR = path.join(
    AUTOMATION_DIR,
    "diagnostics"
);
export const AUTOMATION_ENGINE_DIR = path.join(AUTOMATION_DIR, "engine");
export const AUTOMATION_NAVIGATION_DIR = path.join(
    AUTOMATION_DIR,
    "navigation"
);

export const EXECUTION_LAYER_DIR = path.join(
    FRAMEWORK_CORE_DIR,
    "executionLayer"
);
export const EXECUTION_LAYER_CONTRACTS_DIR = path.join(
    EXECUTION_LAYER_DIR,
    "contracts"
);
export const EXECUTION_LAYER_CORE_DIR = path.join(
    EXECUTION_LAYER_DIR,
    "core"
);
export const EXECUTION_LAYER_RUNTIME_DIR = path.join(
    EXECUTION_LAYER_DIR,
    "runtime"
);
export const EXECUTION_LAYER_MODE_DIR = path.join(
    EXECUTION_LAYER_DIR,
    "mode"
);
export const EXECUTION_LAYER_LOGGING_DIR = path.join(
    EXECUTION_LAYER_DIR,
    "logging"
);
export const EXECUTION_LAYER_CLI_DIR = path.join(
    EXECUTION_LAYER_DIR,
    "cli"
);

export const LOGGING_DIR = path.join(FRAMEWORK_CORE_DIR, "logging");
