// src/tools/page-scanner/scanner/types.ts

import type { Logger } from "../../../utils/logger";

export type ScanPageOptions = {
    connectCdp: string;
    pageKey: string;
    outDir?: string;
    merge?: boolean;
    tabIndex?: number;
    verbose?: boolean;
    log: Logger;
};

export type SelectorCandidate = {
    kind: "css" | "role" | "text";
    selector: string; // e.g. "css=#login" or "role=button[name=/log in/i]"
    score: number; // higher = better
    reason: string; // why we chose it
};

export type ScannedElement = {
    tag: string;
    role: string | null;
    id: string | null;

    name: string | null;
    text: string | null;
    href: string | null;

    dataTestId: string | null;
    dataTest: string | null;
    dataQa: string | null;

    labelText?: string | null;
    ariaLabel?: string | null;
    placeholder?: string | null;
    inputName?: string | null;
    typeAttr?: string | null;
    valueAttr?: string | null;

    // NEW: smart-key context
    ownerId?: string | null;
    ownerLabelText?: string | null;
    ownerAriaLabel?: string | null;
    isFrameworkSearchInput?: boolean;

    candidates: SelectorCandidate[];
    best?: SelectorCandidate;
    key: string;
};

export type PageMap = {
    pageKey: string;
    url: string;
    urlPath?: string;

    // ✅ NEW: HTML document title (from <head><title>…</title>)
    // Optional so old page-maps remain valid.
    title?: string;

    scannedAt: string;
    elements: Record<
        string,
        {
            type: string;
            preferred: string;
            fallbacks: string[];
            meta?: {
                tag: string;
                role?: string | null;
                id?: string | null;

                // Existing meta
                name?: string | null;
                text?: string | null;

                labelText?: string | null;
                ariaLabel?: string | null;
                placeholder?: string | null;
                inputName?: string | null;
                typeAttr?: string | null;

                href?: string | null;
                dataTestId?: string | null;
                dataTest?: string | null;
                dataQa?: string | null;

                // NEW: smart-key context
                ownerId?: string | null;
                ownerLabelText?: string | null;
                ownerAriaLabel?: string | null;
                isFrameworkSearchInput?: boolean | null;
            };
        }
    >;
};