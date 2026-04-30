// src/utils/paths/businessLayer.ts

import path from "node:path";
import { BUSINESS_LAYER_DIR } from "./core";

export const PAGE_SCANNER_DIR = path.join(BUSINESS_LAYER_DIR, "pageScanner");
export const PAGE_SCANNER_MANIFEST_DIR = path.join(PAGE_SCANNER_DIR, ".manifest");
export const PAGE_SCANNER_MANIFEST_INDEX_FILE = path.join(
    PAGE_SCANNER_MANIFEST_DIR,
    "index.json"
);

export const PAGE_OBJECTS_ROOT_DIR = path.join(
    BUSINESS_LAYER_DIR,
    "pageObjects"
);
export const PAGE_MAPS_DIR = PAGE_SCANNER_DIR;
export const PAGE_OBJECTS_DIR = path.join(PAGE_OBJECTS_ROOT_DIR, "objects");
export const PAGE_REGISTRY_DIR = PAGE_OBJECTS_ROOT_DIR;

export const PAGE_MANIFEST_DIR = path.join(PAGE_OBJECTS_ROOT_DIR, ".manifest");
export const PAGE_MANIFEST_INDEX_FILE = path.join(
    PAGE_MANIFEST_DIR,
    "index.json"
);
export const PAGE_MANIFEST_PAGES_DIR = PAGE_MANIFEST_DIR;

export const PAGE_ACTIONS_DIR = path.join(BUSINESS_LAYER_DIR, "pageActions");
export const PAGE_ACTIONS_ACTIONS_DIR = path.join(
    PAGE_ACTIONS_DIR,
    "actions"
);
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
export const PAGE_ACTIONS_REGISTRY_DIR = path.join(
    PAGE_ACTIONS_DIR,
    "registry"
);
export const PAGE_ACTIONS_REGISTRY_INDEX_FILE = path.join(
    PAGE_ACTIONS_REGISTRY_DIR,
    "index.ts"
);
export const PAGE_ACTIONS_RUNTIME_REGISTRY_FILE = path.join(
    PAGE_ACTIONS_REGISTRY_DIR,
    "pageActionsRegistry.ts"
);
export const PAGE_ACTIONS_JOURNEY_PAGES_CONFIG_FILE = path.join(
    PAGE_ACTIONS_DIR,
    "businessJourneyPages.config.ts"
);

export const BUSINESS_JOURNEYS_DIR = path.join(
    BUSINESS_LAYER_DIR,
    "businessJourneys"
);
