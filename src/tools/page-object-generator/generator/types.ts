// src/tools/page-object-generator/generator/types.ts
import type { Logger } from "@/utils/logger";

export type PageMap = {
    pageKey: string;
    scannedAt?: string;
    url?: string;
    urlPath?: string;
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
    pageObjectsDir: string;
    pageRegistryDir: string;
    stateDir?: string;
    stateFile?: string;
    merge?: boolean;
    changedOnly?: boolean;
    stateOnly?: boolean;
    scaffold?: boolean;
    scaffoldIfMissing?: boolean;
    verbose?: boolean;
    log: Logger;
};

export type StateFile = Record<string, string>;