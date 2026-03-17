// src/tools/page-object-generator/generator/types.ts

import type { Logger } from "@/utils/logger";

export type PageMapElement = {
    type: string;
    preferred: string;
    fallbacks: string[];
    meta?: unknown;
    stableKey?: string;
    options?: Record<string, string>;
};

export type PageMap = {
    pageKey: string;
    scannedAt?: string;
    url?: string;
    urlPath?: string;
    title?: string;
    elements: Record<string, PageMapElement>;
};

export type GenOptions = {
    mapsDir: string;
    pageObjectsDir: string;
    pageRegistryDir: string;
    merge?: boolean;
    changedOnly?: boolean;
    verbose?: boolean;
    log: Logger;
};