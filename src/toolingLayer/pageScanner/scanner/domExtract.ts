// src/tools/pageScanner/scanner/domExtract.ts

import type { Page } from "@playwright/test";
import type { ScannedElement } from "./types";
import { browserExtractDomElements } from "./domExtractors/browserExtract";
import { SCAN_SELECTOR } from "./domExtractors/selector";

export async function extractDomElements(page: Page): Promise<ScannedElement[]> {
    const scanned = await page.evaluate(browserExtractDomElements, {
        selector: SCAN_SELECTOR,
    });

    return scanned as ScannedElement[];
}