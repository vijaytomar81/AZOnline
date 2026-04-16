// src/toolingLayer/pageScanner/scanner/reporting/types.ts

import type { PageScanOperation } from "@configLayer/tooling/pageScanner";
import type { TreeNode } from "@utils/cliTree";
import type { PageKeyParts } from "../pageKey/types";
import type { PageMapDiff } from "../pageMap/diffPageMaps";

export type ScannerManifestIndex = {
    version: 1;
    generatedAt: string;
    pages: Record<
        string,
        {
            file: string;
            elementCount: number;
            scannedAt: string;
        }
    >;
};

export type ScanPageResult = {
    pageKey: string;
    operation: PageScanOperation;
    outFile: string;
    elementsFound: number;
    diff: PageMapDiff;
    errorMessage?: string;
    scope?: PageKeyParts;
};

export type ScanSummaryRow = {
    label: string;
    value: string | number;
};

export type ScanTreeBuilder = (result: ScanPageResult) => TreeNode[];
