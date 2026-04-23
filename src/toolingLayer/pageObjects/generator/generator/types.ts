// src/toolingLayer/pageObjects/generator/generator/types.ts

import type { Logger } from "@utils/logger";

export type PageMapElement = {
    type: string;
    preferred: string;
    fallbacks: string[];
    meta?: unknown;
    stableKey?: string;
    options?: Record<string, string>;
};

export type PageMapReadiness = {
    recommendedAliases: string[];
};

export type PageMap = {
    pageKey: string;
    scannedAt?: string;
    url?: string;
    urlPath?: string;
    title?: string;
    readiness?: PageMapReadiness;
    elements: Record<string, PageMapElement>;
};

export type GenOptions = {
    mapsDir: string;
    pageObjectsDir: string;
    pageRegistryDir: string;
    verbose?: boolean;
    log: Logger;
};
