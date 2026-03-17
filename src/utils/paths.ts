// src/utils/paths.ts
import path from "node:path";

/**
 * Repository root
 */
export const ROOT = process.cwd();

/**
 * Core directories
 */
export const SRC_DIR = path.join(ROOT, "src");

/**
 * Pages domain
 */
export const PAGES_DIR = path.join(SRC_DIR, "pages");
export const PAGE_MAPS_DIR = path.join(PAGES_DIR, "maps");
export const PAGE_OBJECTS_DIR = path.join(PAGES_DIR, "objects");
export const PAGE_REGISTRY_DIR = PAGES_DIR;

/**
 * Page manifest
 */
export const PAGE_MANIFEST_DIR = path.join(PAGES_DIR, ".manifest");
export const PAGE_OBJECTS_MANIFEST_FILE = path.join(
    PAGE_MANIFEST_DIR,
    "page-objects.manifest.json"
);

/**
 * Page generator state
 */
export const PAGE_MAP_STATE_DIR = path.join(PAGES_DIR, ".state");
export const PAGE_MAP_STATE_FILE = path.join(
    PAGE_MAP_STATE_DIR,
    "page-maps-state.json"
);

/**
 * Page Scanner
 */
export const PAGE_SCANNER_DIR = path.join(
    SRC_DIR,
    "tools",
    "page-scanner"
);

/**
 * Page Elements Generator
 */
export const PAGE_ELEMENTS_GENERATOR_DIR = path.join(
    SRC_DIR,
    "tools",
    "page-elements-generator"
);

/**
 * Data Builder
 */
export const DATA_BUILDER_DIR = path.join(SRC_DIR, "data", "data-builder");
export const DATA_BUILDER_PLUGINS_DIR = path.join(DATA_BUILDER_DIR, "plugins");
export const DATA_GENERATED_DIR = path.join(SRC_DIR, "data", "generated");

/**
 * Log files
 */
export const PAGE_SCANNER_LOG_FILE = path.join(ROOT, "page-scanner.log");
export const PAGE_ELEMENTS_GENERATOR_LOG_FILE = path.join(
    ROOT,
    "page-elements-generator.log"
);
export const PAGE_ELEMENTS_VALIDATOR_LOG_FILE = path.join(
    ROOT,
    "page-elements-validator.log"
);
export const DATA_BUILDER_LOG_FILE = path.join(ROOT, "data-builder.log");

/**
 * Convert absolute path to repo-relative path.
 *
 * Example:
 * /Users/x/project/src/pages/a.ts
 * → src/pages/a.ts
 */
export function toRepoRelative(filePath: string): string {
    const cwd = process.cwd();

    const relative = path.relative(cwd, filePath);

    return relative.replace(/\\/g, "/");
}
