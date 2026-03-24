// src/utils/paths.ts

import path from "node:path";
import { toKebabFromSnake } from "./text";

/* =========================================================
 * 🧱 CORE (Root + Base)
 * ======================================================= */

export const ROOT = process.cwd();
export const SRC_DIR = path.join(ROOT, "src");

/* =========================================================
 * 📄 PAGES DOMAIN
 * ======================================================= */

export const PAGES_DIR = path.join(SRC_DIR, "pages");
export const PAGE_MAPS_DIR = path.join(PAGES_DIR, "maps");
export const PAGE_OBJECTS_DIR = path.join(PAGES_DIR, "objects");
export const PAGE_REGISTRY_DIR = PAGES_DIR;

// Manifest
export const PAGE_MANIFEST_DIR = path.join(PAGES_DIR, ".manifest");
export const PAGE_MANIFEST_INDEX_FILE = path.join(PAGE_MANIFEST_DIR, "index.json");
export const PAGE_MANIFEST_PAGES_DIR = path.join(PAGE_MANIFEST_DIR, "pages");

/* =========================================================
 * 🛠️ TOOLS DOMAIN
 * ======================================================= */

export const TOOLS_DIR = path.join(SRC_DIR, "tools");

export const PAGE_SCANNER_DIR = path.join(TOOLS_DIR, "page-scanner");
export const PAGE_OBJECT_GENERATOR_DIR = path.join(TOOLS_DIR, "page-object-generator");
export const PAGE_OBJECT_VALIDATOR_DIR = path.join(TOOLS_DIR, "page-object-validator");
export const PAGE_OBJECT_REPAIR_DIR = path.join(TOOLS_DIR, "page-object-repair");

/* =========================================================
 * 📊 DATA DOMAIN
 * ======================================================= */

export const DATA_DIR = path.join(SRC_DIR, "data");

// Builder
export const DATA_BUILDER_DIR = path.join(DATA_DIR, "builder");
export const DATA_BUILDER_PLUGINS_DIR = path.join(DATA_BUILDER_DIR, "plugins");

// Runtime / Definitions
export const DATA_RUNTIME_DIR = path.join(DATA_DIR, "runtime");
export const DATA_DEFINITIONS_DIR = path.join(DATA_DIR, "data-definitions");

// Generated
export const DATA_GENERATED_DIR = path.join(DATA_DIR, "generated");
export const DATA_GENERATED_ARCHIVE_DIR = path.join(DATA_GENERATED_DIR, "archive");

// index file
export const DATA_GENERATED_INDEX_FILE = path.join(DATA_GENERATED_DIR, "index.json");

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
 * ⚙️ EXECUTION DOMAIN
 * ======================================================= */

export const EXECUTION_DIR = path.join(SRC_DIR, "execution");

export const EXECUTION_CORE_DIR = path.join(EXECUTION_DIR, "core");
export const EXECUTION_RUNTIME_DIR = path.join(EXECUTION_DIR, "runtime");
export const EXECUTION_MODES_DIR = path.join(EXECUTION_DIR, "modes");
export const EXECUTION_JOURNEYS_DIR = path.join(EXECUTION_DIR, "journeys");

export const EXECUTION_FIXTURES_DIR = path.join(EXECUTION_DIR, "fixtures");
export const EXECUTION_ASSERTIONS_DIR = path.join(EXECUTION_DIR, "assertions");
export const EXECUTION_PAGE_ACTIONS_DIR = path.join(EXECUTION_DIR, "page-actions");

/* =========================================================
 * 🧾 LOG FILES
 * ======================================================= */

export const LOGS_DIR = ROOT; // (can be moved to /logs later)

export const PAGE_SCANNER_LOG_FILE = path.join(LOGS_DIR, "page-scanner.log");
export const PAGE_OBJECT_GENERATOR_LOG_FILE = path.join(LOGS_DIR, "page-object-generator.log");
export const PAGE_OBJECT_VALIDATOR_LOG_FILE = path.join(LOGS_DIR, "page-object-validator.log");
export const PAGE_OBJECT_REPAIR_LOG_FILE = path.join(LOGS_DIR, "page-object-repair.log");
export const DATA_BUILDER_LOG_FILE = path.join(LOGS_DIR, "data-builder.log");

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