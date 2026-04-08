// src/toolingLayer/pageScanner/scanner/pageMap/buildStableElementKey.ts

import { createHash } from "node:crypto";
import type { PageMapElementEntry } from "../types";

function normalizePart(value: unknown): string {
    return String(value ?? "")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
}

export function buildStableElementKey(element: PageMapElementEntry): string {
    const meta = element.meta;

    const raw = [
        element.type,
        meta?.tag,
        meta?.role,
        meta?.id,
        meta?.inputName,
        meta?.typeAttr,
        meta?.dataTestId,
        meta?.dataQa,
        meta?.dataTest,
        meta?.ownerId,
        meta?.ownerLabelText,
        meta?.ownerAriaLabel,
        meta?.ownerGroupLabelFor,
        meta?.labelText,
        meta?.ariaLabel,
        meta?.placeholder,
        meta?.name,
        meta?.href,
    ]
        .map(normalizePart)
        .join("|");

    return createHash("sha1").update(raw).digest("hex").slice(0, 12);
}