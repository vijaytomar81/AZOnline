// src/utils/paths/businessLayer.ts

import path from "node:path";
import { BUSINESS_LAYER_DIR } from "./core";

export const PAGE_OBJECTS_ROOT_DIR = path.join(
    BUSINESS_LAYER_DIR,
    "pageObjects"
);
export const PAGE_MAPS_DIR = path.join(PAGE_OBJECTS_ROOT_DIR, "maps");
export const PAGE_OBJECTS_DIR = path.join(PAGE_OBJECTS_ROOT_DIR, "objects");
export const PAGE_REGISTRY_DIR = PAGE_OBJECTS_ROOT_DIR;

export const PAGE_MANIFEST_DIR = path.join(PAGE_OBJECTS_ROOT_DIR, ".manifest");
export const PAGE_MANIFEST_INDEX_FILE = path.join(
    PAGE_MANIFEST_DIR,
    "index.json"
);
export const PAGE_MANIFEST_PAGES_DIR = path.join(
    PAGE_MANIFEST_DIR,
    "pages"
);

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
export const PAGE_ACTIONS_JOURNEY_PAGES_CONFIG_FILE = path.join(
    PAGE_ACTIONS_DIR,
    "businessJourneyPages.config.ts"
);

export const BUSINESS_JOURNEYS_DIR = path.join(
    BUSINESS_LAYER_DIR,
    "businessJourneys"
);
