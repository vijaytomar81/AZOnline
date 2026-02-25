// src/scanner/types.ts

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

    // Existing fields
    name: string | null; // aria-label or derived label/text
    text: string | null; // innerText
    href: string | null;

    dataTestId: string | null;
    dataTest: string | null;
    dataQa: string | null;

    // ✅ NEW: label-first / enterprise metadata
    labelText?: string | null; // resolved associated <label> text
    ariaLabel?: string | null; // raw aria-label
    placeholder?: string | null; // input placeholder
    inputName?: string | null; // input[name="..."]
    typeAttr?: string | null; // input type="text|email|..."
    valueAttr?: string | null; // optional (keep null by default to avoid PII)

    candidates: SelectorCandidate[];
    best?: SelectorCandidate;

    // Internal stable key we generate
    key: string; // e.g. "date_of_claim_month" or "button.log_in"
};

export type PageMap = {
    pageKey: string; // e.g. "common.auth-entry"
    url: string; // full url used for scan
    urlPath?: string; // if provided
    scannedAt: string; // ISO time
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

                // Existing meta
                name?: string | null;
                text?: string | null;

                // ✅ NEW meta (stored in mapper json)
                labelText?: string | null;
                ariaLabel?: string | null;
                placeholder?: string | null;
                inputName?: string | null;
                typeAttr?: string | null;
            };
        }
    >;
};