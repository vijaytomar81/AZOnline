import type { Page } from "@playwright/test";
import type { ScannedElement } from "./types";

import { buildScanRoots, SCAN_SELECTOR } from "./domExtractors/roots";
import { isInsideFooter, isNestedInteractiveDuplicate, isVisible } from "./domExtractors/nodeFilters";
import { serializeElement } from "./domExtractors/serialize";

export async function extractDomElements(page: Page): Promise<ScannedElement[]> {
    const scanned = await page.evaluate(
        ({ selector }) => {
            const roots = buildScanRoots(document);

            const seen = new Set<Element>();
            const nodes: Element[] = [];

            for (const root of roots) {
                const found = Array.from(root.querySelectorAll(selector)).filter(
                    (el) =>
                        !isInsideFooter(el) &&
                        isVisible(el) &&
                        !isNestedInteractiveDuplicate(el)
                );

                for (const el of found) {
                    if (seen.has(el)) continue;
                    seen.add(el);
                    nodes.push(el);
                }
            }

            return nodes.map((el) => serializeElement(el));
        },
        { selector: SCAN_SELECTOR }
    );

    return scanned as ScannedElement[];
}