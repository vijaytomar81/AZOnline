// src/scanner/index.ts

export { scanPage } from "./page-scanner/runner";
export type { ScanPageOptions } from "./page-scanner/types";

export type { PageMap, ScannedElement, SelectorCandidate } from "./types";
export { createLogger } from "./logger";
