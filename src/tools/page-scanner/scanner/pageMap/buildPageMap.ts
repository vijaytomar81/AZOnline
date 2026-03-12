// \src/tools/page-scanner/scanner/pageMap/buildPageMap.ts

import { nowIso } from "../../../../utils/time";
import { uniq, uniqueKey } from "../../../../utils/collections";
import type {
    PageMap,
    PageMapElementEntry,
    ScannedElement,
    SelectorCandidate,
} from "../types";
import { buildSelectors } from "../selectors/buildSelectors";
import { getSmartElementKey } from "../getSmartElementsKey";
import { appendGroupedRadioCheckboxEntries } from "./groupControls";
import { classifyElementType } from "./classifyElementType";

function toPageMapEntry(
    el: ScannedElement,
    best: SelectorCandidate,
    fallbacks: string[],
    type: string
): PageMapElementEntry {
    return {
        type,
        preferred: best.selector,
        fallbacks,
        meta: {
            tag: el.tag,
            role: el.role,
            id: el.id,
            name: el.name,
            text: el.text,
            labelText: el.labelText ?? null,
            ariaLabel: el.ariaLabel ?? null,
            placeholder: el.placeholder ?? null,
            inputName: el.inputName ?? null,
            typeAttr: el.typeAttr ?? null,
            href: el.href ?? null,
            dataTestId: el.dataTestId ?? null,
            dataTest: el.dataTest ?? null,
            dataQa: el.dataQa ?? null,
            ownerId: el.ownerId ?? null,
            ownerLabelText: el.ownerLabelText ?? null,
            ownerAriaLabel: el.ownerAriaLabel ?? null,
            ownerGroupLabelFor: el.ownerGroupLabelFor ?? null,
            isFrameworkSearchInput: el.isFrameworkSearchInput ?? null,
        },
    };
}

export function buildPageMap(params: {
    pageKey: string;
    url: string;
    title?: string;
    scanned: ScannedElement[];
    verbose?: boolean;
    onDebug?: (message: string) => void;
}): PageMap {
    const { pageKey, url, title, scanned, verbose, onDebug } = params;

    const usedKeys = new Set<string>();
    const perBaseCounter = new Map<string, number>();

    const pageMap: PageMap = {
        pageKey,
        url,
        urlPath: (() => {
            try {
                return new URL(url).pathname;
            } catch {
                return undefined;
            }
        })(),
        scannedAt: nowIso(),
        title,
        elements: {},
    };

    const builtElements: Array<{
        key: string;
        type: string;
        element: ScannedElement;
        entry: PageMapElementEntry;
    }> = [];

    for (let idx = 0; idx < scanned.length; idx++) {
        const el = scanned[idx];

        const baseKey = getSmartElementKey(el, idx + 1);
        const bump = (perBaseCounter.get(baseKey) ?? 0) + 1;
        perBaseCounter.set(baseKey, bump);

        const finalKey = uniqueKey(
            bump === 1 ? baseKey : `${baseKey}${bump}`,
            usedKeys
        );

        const cands = buildSelectors(el);
        const best = cands[0];
        if (!best) continue;

        const fallbacks = uniq(cands.slice(1).map((c) => c.selector));
        const type = classifyElementType(el);
        const entry = toPageMapEntry(el, best, fallbacks, type);

        pageMap.elements[finalKey] = entry;
        builtElements.push({
            key: finalKey,
            type,
            element: el,
            entry,
        });

        if (verbose && onDebug) {
            onDebug(`KEY=${finalKey} type=${type} best=${best.selector} (${best.reason})`);
        }
    }

    appendGroupedRadioCheckboxEntries(pageMap, builtElements);

    return pageMap;
}