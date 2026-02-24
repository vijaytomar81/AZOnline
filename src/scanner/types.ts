// src/scanner/types.ts

export type SelectorCandidate = {
    kind: "css" | "role" | "text";
    selector: string;      // e.g. "css=#login" or "role=button[name=/log in/i]"
    score: number;         // higher = better
    reason: string;        // why we chose it
};

export type ScannedElement = {
    tag: string;
    role: string | null;
    id: string | null;
    name: string | null;         // aria-label or derived label/text
    text: string | null;         // innerText
    href: string | null;

    dataTestId: string | null;
    dataTest: string | null;
    dataQa: string | null;

    candidates: SelectorCandidate[];
    best?: SelectorCandidate;

    // An internal stable key we generate
    key: string; // e.g. "button.log_in" or "link.register_later"
};

export type PageMap = {
    pageKey: string;      // e.g. "common.authEntry"
    url: string;          // full url used for scan
    urlPath?: string;     // if provided
    scannedAt: string;    // ISO time
    elements: Record<
        string,
        {
            type: string; // button/link/input/...
            preferred: string;
            fallbacks: string[];
            meta?: {
                tag: string;
                role?: string | null;
                id?: string | null;
                name?: string | null;
                text?: string | null;
            };
        }
    >;
};