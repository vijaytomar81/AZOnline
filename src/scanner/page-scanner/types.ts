// src/scanner/page-scanner/types.ts

import type { Logger } from "../logger";
import type { PageMap, ScannedElement, SelectorCandidate } from "../types";

export type ScanPageOptions = {
    connectCdp: string;
    pageKey: string;
    outDir?: string;
    merge?: boolean;
    tabIndex?: number;
    verbose?: boolean;
    log: Logger;
};

// Re-export existing shared types so new modules can import from one place.
export type { PageMap, ScannedElement, SelectorCandidate };