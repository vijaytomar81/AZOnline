// src/configLayer/tooling/pageObjects.ts

export const PAGE_OBJECT_GENERATION_STATUSES = {
    GENERATED: "generated",
    UNCHANGED: "unchanged",
} as const;

export type PageObjectGenerationStatus =
    typeof PAGE_OBJECT_GENERATION_STATUSES[keyof typeof PAGE_OBJECT_GENERATION_STATUSES];

export const PAGE_OBJECT_FILE_STATUSES = {
    GENERATED: "generated",
    SYNCED: "synced",
    UNCHANGED: "unchanged",
} as const;

export type PageObjectFileStatus =
    typeof PAGE_OBJECT_FILE_STATUSES[keyof typeof PAGE_OBJECT_FILE_STATUSES];

export const REPAIR_GROUP_KEYS = {
    PAGE_CHAIN: "pageChain",
    MANIFEST: "manifest",
    REGISTRY: "registry",
    OTHER: "other",
} as const;

export type RepairGroupKey =
    typeof REPAIR_GROUP_KEYS[keyof typeof REPAIR_GROUP_KEYS];

export const PAGE_OBJECT_KEY_CONFIG = {
    delimiter: ".",
    minimumParts: 4,
    indexes: {
        platform: 0,
        application: 1,
        product: 2,
        nameStart: 3,
    },
} as const;

export const PAGE_OBJECT_INVALID_REASONS = {
    INVALID_PAGE_KEY: "invalid-page-key",
} as const;

export type PageObjectInvalidReason =
    typeof PAGE_OBJECT_INVALID_REASONS[keyof typeof PAGE_OBJECT_INVALID_REASONS];
