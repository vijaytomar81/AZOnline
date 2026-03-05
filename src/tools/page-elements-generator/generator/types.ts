// src/scanner/elements-generator/types.ts

import type { Logger } from "../logger";

export type PageMap = {
    pageKey: string; // e.g. "motor.car-details"
    scannedAt?: string;

    // optional (depends on scanner version)
    url?: string;
    urlPath?: string;

    // ✅ NEW: HTML document title (from <head><title>)
    // Optional so older page-maps remain valid.
    title?: string;

    elements: Record<
        string,
        {
            type: string;
            preferred: string;
            fallbacks: string[];
            meta?: any;
        }
    >;
};

export type GenOptions = {
    mapsDir: string;
    pagesDir: string;

    // state is stored outside page-maps
    stateDir?: string;
    stateFile?: string;

    merge?: boolean;
    verbose?: boolean;
    changedOnly?: boolean;
    stateOnly?: boolean;

    // Level-7 scaffolding (default ON)
    scaffold?: boolean;

    /**
     * ✅ New behavior:
     * When changedOnly is enabled, still scaffold if the output folder/files are missing.
     * Default: true
     */
    scaffoldIfMissing?: boolean;

    log: Logger;
};

export type StateFile = Record<string, string>; // mapFile -> hash