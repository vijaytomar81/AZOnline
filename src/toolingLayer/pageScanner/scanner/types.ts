// src/toolingLayer/pageScanner/scanner/types.ts

import type { Logger } from "@utils/logger";
import type {
    ControlGroupType,
    PageDiffStatus,
    SelectorKind,
} from "@configLayer/tooling/pageScanner";

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
    kind: SelectorKind;
    selector: string;
    score: number;
    reason: string;
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

    ownerId?: string | null;
    ownerLabelText?: string | null;
    ownerAriaLabel?: string | null;
    ownerGroupLabelFor?: string | null;
    isFrameworkSearchInput?: boolean;

    candidates: SelectorCandidate[];
    best?: SelectorCandidate;
    key: string;
};

export type PageMapElementMeta = {
    tag: string;
    role?: string | null;
    id?: string | null;

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

    ownerId?: string | null;
    ownerLabelText?: string | null;
    ownerAriaLabel?: string | null;
    ownerGroupLabelFor?: string | null;
    isFrameworkSearchInput?: boolean | null;
};

export type PageMapElementEntry = {
    type: string;
    preferred: string;
    fallbacks: string[];
    stableKey?: string;
    meta?: PageMapElementMeta;
};

export type PageMapGroupEntry = {
    type: ControlGroupType;
    preferred: "";
    fallbacks: [];
    stableKey?: string;
    options: Record<string, string>;
    meta?: {
        inputName?: string | null;
        ownerLabelText?: string | null;
        ownerAriaLabel?: string | null;
        ownerId?: string | null;
    };
};

export type PageMapEntry = PageMapElementEntry | PageMapGroupEntry;

export type PageMapReadiness = {
    recommendedAliases: string[];
};

export type PageMap = {
    pageKey: string;
    url: string;
    urlPath?: string;
    title?: string;
    scannedAt: string;
    readiness?: PageMapReadiness;
    elements: Record<string, PageMapEntry>;
};

export type PageDiffItem = {
    stableKey: string;
    status: PageDiffStatus;
    existingKey?: string;
    incomingKey?: string;
    reason?: string;
};

export type PageDiffSummary = {
    added: PageDiffItem[];
    removed: PageDiffItem[];
    updated: PageDiffItem[];
    unchanged: PageDiffItem[];
};