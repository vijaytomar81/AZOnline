// src/scanner/scanPage.ts

import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";
import { createLogger } from "./logger";

type ScanOptions = {
    connectCdp: string;
    pageKey: string;
    tabUrlRegex?: string;
    merge?: boolean;
    outDir?: string;
    verbose?: boolean;
};

type ElementMap = Record<string, string>;

function mergeMaps(oldMap: ElementMap, newMap: ElementMap): ElementMap {
    return { ...oldMap, ...newMap };
}

export async function scanPage(opts: ScanOptions) {
    const log = createLogger({
        prefix: "[scanner]",
        verbose: opts.verbose,
        withTimestamp: true,
    });

    const outDir =
        opts.outDir ??
        path.join(process.cwd(), "src", "page-maps");

    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    const outFile = path.join(outDir, `${opts.pageKey}.json`);

    log.info(`Connecting to browser: ${opts.connectCdp}`);

    const browser = await chromium.connectOverCDP(opts.connectCdp);

    try {
        const contexts = browser.contexts();
        if (!contexts.length) {
            throw new Error("No browser contexts found.");
        }

        const pages = contexts[0].pages();
        if (!pages.length) {
            throw new Error("No open tabs found.");
        }

        // -----------------------------
        // Find target page
        // -----------------------------
        let page = pages[0];

        if (opts.tabUrlRegex) {
            const regex = new RegExp(
                opts.tabUrlRegex.replace(/^\/|\/$/g, "")
            );

            const matched = pages.find((p) =>
                regex.test(p.url())
            );

            if (!matched) {
                throw new Error(
                    `No tab matched regex: ${opts.tabUrlRegex}`
                );
            }

            page = matched;
        }

        log.info(`Scanning tab: ${page.url()}`);

        // -----------------------------
        // Scan DOM elements
        // -----------------------------
        const elements: ElementMap = await page.evaluate(() => {
            const result: Record<string, string> = {};

            const nodes = Array.from(
                document.querySelectorAll<
                    HTMLInputElement |
                    HTMLSelectElement |
                    HTMLTextAreaElement |
                    HTMLButtonElement
                >("input, select, textarea, button")
            );

            for (const el of nodes) {
                const label =
                    el.getAttribute("aria-label") ||
                    el.getAttribute("name") ||
                    el.id ||
                    el.textContent ||
                    "element";

                const key = label
                    .trim()
                    .toLowerCase()
                    .replace(/\s+/g, "_")
                    .replace(/[^a-z0-9_]/g, "");

                if (!key) continue;

                let locator = "";

                if (el.id) {
                    locator = `#${el.id}`;
                } else if (el.getAttribute("name")) {
                    locator = `[name="${el.getAttribute("name")}"]`;
                } else {
                    locator = el.tagName.toLowerCase();
                }

                if (!result[key]) {
                    result[key] = locator;
                }
            }

            return result;
        });

        log.info(`Elements found: ${Object.keys(elements).length}`);

        let finalMap = elements;

        // -----------------------------
        // Merge mode (amend existing)
        // -----------------------------
        if (opts.merge && fs.existsSync(outFile)) {
            log.info("Merging with existing mapper...");

            const existing = JSON.parse(
                fs.readFileSync(outFile, "utf8")
            );

            finalMap = mergeMaps(existing, elements);
        }

        fs.writeFileSync(
            outFile,
            JSON.stringify(finalMap, null, 2),
            "utf8"
        );

        log.info(`Mapper written: ${outFile}`);
    } catch (err: any) {
        log.error(err.message);
        throw err;
    } finally {
        // ⭐ IMPORTANT
        // connectOverCDP + close = SAFE DETACH
        await browser.close();
        log.debug("Disconnected from browser (browser remains open).");
    }
}