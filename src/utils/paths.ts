// src/utils/paths.ts

import path from "node:path";
import { toKebabFromSnake } from "./text";

/* =========================================================
 * 🧱 CORE (Root + Base)
 * ======================================================= */

export const ROOT = process.cwd();
export const SRC_DIR = path.join(ROOT, "src");

/* =========================================================
 * 📄 PAGE OBJECTS DOMAIN
 * ======================================================= */

export const PAGE_OBJECTS_ROOT_DIR = path.join(SRC_DIR, "pageObjects");
export const PAGE_MAPS_DIR = path.join(PAGE_OBJECTS_ROOT_DIR, "maps");
export const PAGE_OBJECTS_DIR = path.join(PAGE_OBJECTS_ROOT_DIR, "objects");
export const PAGE_REGISTRY_DIR = PAGE_OBJECTS_ROOT_DIR;

// Manifest
export const PAGE_MANIFEST_DIR = path.join(PAGE_OBJECTS_ROOT_DIR, ".manifest");
export const PAGE_MANIFEST_INDEX_FILE = path.join(PAGE_MANIFEST_DIR, "index.json");
export const PAGE_MANIFEST_PAGES_DIR = path.join(PAGE_MANIFEST_DIR, "pages");

/* =========================================================
 * 🛠️ PAGE OBJECT TOOLS DOMAIN
 * ======================================================= */

export const PAGE_OBJECT_TOOLS_DIR = path.join(SRC_DIR, "pageObjectTools");

export const PAGE_SCANNER_DIR = path.join(
    PAGE_OBJECT_TOOLS_DIR,
    "page-scanner"
);
export const PAGE_OBJECT_GENERATOR_DIR = path.join(
    PAGE_OBJECT_TOOLS_DIR,
    "page-object-generator"
);
export const PAGE_OBJECT_VALIDATOR_DIR = path.join(
    PAGE_OBJECT_TOOLS_DIR,
    "page-object-validator"
);
export const PAGE_OBJECT_REPAIR_DIR = path.join(
    PAGE_OBJECT_TOOLS_DIR,
    "page-object-repair"
);

/* =========================================================
 * 📊 DATA LAYER DOMAIN
 * ======================================================= */

export const DATA_LAYER_DIR = path.join(SRC_DIR, "dataLayer");

// Builder
export const DATA_BUILDER_DIR = path.join(DATA_LAYER_DIR, "builder");
export const DATA_BUILDER_PLUGINS_DIR = path.join(
    DATA_BUILDER_DIR,
    "plugins"
);

// Runtime / Definitions
export const DATA_RUNTIME_DIR = path.join(DATA_LAYER_DIR, "runtime");
export const DATA_DEFINITIONS_DIR = path.join(
    DATA_LAYER_DIR,
    "data-definitions"
);

// Generated
export const DATA_GENERATED_DIR = path.join(DATA_LAYER_DIR, "generated");
export const DATA_GENERATED_ARCHIVE_DIR = path.join(
    DATA_GENERATED_DIR,
    "archive"
);

// Index file
export const DATA_GENERATED_INDEX_FILE = path.join(
    DATA_GENERATED_DIR,
    "index.json"
);

/**
 * 📦 Data domains (central source of truth)
 */
export const DATA_DOMAINS = {
    NEW_BUSINESS: "new-business",
    // FUTURE:
    // RENEWAL: "renewal",
    // CLAIMS: "claims",
} as const;

/**
 * Strongly typed domain
 */
export type DataDomain =
    (typeof DATA_DOMAINS)[keyof typeof DATA_DOMAINS];

// Generated domain folders
export const DATA_GENERATED_NEW_BUSINESS_DIR = path.join(
    DATA_GENERATED_DIR,
    DATA_DOMAINS.NEW_BUSINESS
);

/* =========================================================
 * ⚙️ EXECUTION LAYER DOMAIN
 * ======================================================= */

export const EXECUTION_LAYER_DIR = path.join(SRC_DIR, "executionLayer");

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

/* =========================================================
 * 🧭 BUSINESS JOURNEYS DOMAIN
 * ======================================================= */

export const BUSINESS_JOURNEYS_DIR = path.join(
    SRC_DIR,
    "businessJourneys"
);

/* =========================================================
 * 🖱️ PAGE ACTIONS DOMAIN
 * ======================================================= */

export const PAGE_ACTIONS_DIR = path.join(SRC_DIR, "pageActions");

export const PAGE_ACTIONS_ACTIONS_DIR = path.join(
    PAGE_ACTIONS_DIR,
    "actions"
);

// Manifest
export const PAGE_ACTIONS_MANIFEST_DIR = path.join(
    PAGE_ACTIONS_DIR,
    ".manifest"
);

export const PAGE_ACTIONS_MANIFEST_INDEX_FILE = path.join(
    PAGE_ACTIONS_MANIFEST_DIR,
    "index.json"
);
export const PAGE_ACTIONS_MANIFEST_ACTIONS_DIR = path.join(
    PAGE_ACTIONS_MANIFEST_DIR,
    "actions"
);

/* =========================================================
 * 🛠️ PAGE ACTION TOOLS DOMAIN
 * ======================================================= */

export const PAGE_ACTION_TOOLS_DIR = path.join(
    SRC_DIR,
    "pageActionTools"
);

export const PAGE_ACTION_GENERATOR_DIR = path.join(
    PAGE_ACTION_TOOLS_DIR,
    "page-action-generator"
);

/* =========================================================
 * 🤖 AUTOMATION DOMAIN
 * ======================================================= */

export const AUTOMATION_DIR = path.join(SRC_DIR, "automation");

export const AUTOMATION_BASE_DIR = path.join(
    AUTOMATION_DIR,
    "base"
);
export const AUTOMATION_CONTROLS_DIR = path.join(
    AUTOMATION_DIR,
    "controls"
);
export const AUTOMATION_NAVIGATION_DIR = path.join(
    AUTOMATION_DIR,
    "navigation"
);
export const AUTOMATION_DIAGNOSTICS_DIR = path.join(
    AUTOMATION_DIR,
    "diagnostics"
);
export const AUTOMATION_RUNTIME_DIR = path.join(
    AUTOMATION_DIR,
    "runtime"
);
export const AUTOMATION_ASSERTIONS_DIR = path.join(
    AUTOMATION_DIR,
    "assertions"
);
export const AUTOMATION_TYPES_DIR = path.join(
    AUTOMATION_DIR,
    "types"
);

/* =========================================================
 * 🧾 Evidence
 * ======================================================= */

export const EVIDENCE_OUTPUT_ROOT = path.join("results", "evidence");


/* =========================================================
 * 🧾 LOG FILES
 * ======================================================= */

export const LOGS_DIR = ROOT; // (can be moved to /logs later)

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

/* =========================================================
 * 📁 DATA HELPERS (DOMAIN LOGIC)
 * ======================================================= */

/**
 * Default: NEW_BUSINESS domain (backward-compatible)
 */
export function getGeneratedSchemaDir(schemaName: string): string {
    return getGeneratedSchemaDirByDomain(
        DATA_DOMAINS.NEW_BUSINESS,
        schemaName
    );
}

/**
 * Archive path (default domain)
 */
export function getGeneratedSchemaArchiveDir(schemaName: string): string {
    return path.join(
        DATA_GENERATED_ARCHIVE_DIR,
        DATA_DOMAINS.NEW_BUSINESS,
        toKebabFromSnake(schemaName)
    );
}

/**
 * 🔥 Domain-aware directory resolver (future-proof)
 */
export function getGeneratedSchemaDirByDomain(
    domain: DataDomain,
    schemaName: string
): string {
    return path.join(
        DATA_GENERATED_DIR,
        domain,
        toKebabFromSnake(schemaName)
    );
}

/* =========================================================
 * 🔁 UTILITY HELPERS
 * ======================================================= */

/**
 * Convert absolute path → repo-relative path
 */
export function toRepoRelative(filePath: string): string {
    return path.relative(ROOT, filePath).replace(/\\/g, "/");
}
