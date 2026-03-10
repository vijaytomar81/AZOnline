// src/tools/page-scanner/scanner/runner.ts

import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

import type { Logger } from "../../../utils/logger";
import { ensureDir, safeReadJson } from "../../../utils/fs";
import { nowIso } from "../../../utils/time";
import { uniq, uniqueKey } from "../../../utils/collections";
import { PAGE_SCANNER_MAPS_DIR } from "../../../utils/paths";
import type { PageMap, ScannedElement } from "./types";
import { buildSelectors } from "./selectorPipeline";
import { extractDomElements } from "./domExtract";
import { getSmartElementKey } from "./getSmartElementsKey";

export type ScanPageOptions = {
    connectCdp: string; // required (http or ws)
    pageKey: string; // required e.g. "motor.car-details"
    outDir?: string; // default: ./src/page-maps
    merge?: boolean; // default false
    tabIndex?: number; // default 0
    verbose?: boolean; // debug logs
    log: Logger; // required
};

function classifyType(el: ScannedElement) {
    const tag = (el.tag || "").toLowerCase();
    const role = (el.role || "").toLowerCase();
    const type = (el.typeAttr || "").toLowerCase();

    if (role === "alert") return "alert";
    if (role === "dialog") return "dialog";

    if (tag === "button" || role === "button") return "button";
    if (tag === "a" || role === "link") return "link";
    if (tag === "select" || role === "combobox") return "select";
    if (tag === "textarea") return "textarea";

    if (tag === "input") {
        if (type === "checkbox") return "checkbox";
        if (type === "radio") return "radio";
        return "input";
    }

    if (tag === "div" && el.text) return "message";

    return role || tag || "element";
}

/**
 * Merge strategy:
 * - Keep existing keys stable.
 * - If preferred differs, keep old as fallback and promote new preferred.
 * - Union fallbacks.
 * - Merge meta (new wins where defined), and always keep meta.tag defined.
 * - Title: prefer incoming if present, otherwise keep existing.
 */
function mergePageMaps(existing: PageMap, incoming: PageMap): PageMap {
    const out: PageMap = {
        ...existing,
        pageKey: existing.pageKey || incoming.pageKey,
        url: incoming.url || existing.url,
        urlPath: incoming.urlPath ?? existing.urlPath,
        scannedAt: incoming.scannedAt,
        title: incoming.title ?? existing.title,
        elements: { ...existing.elements },
    };

    for (const key of Object.keys(incoming.elements)) {
        const next = incoming.elements[key];
        const cur = out.elements[key];

        if (!cur) {
            out.elements[key] = next;
            continue;
        }

        let preferred = cur.preferred;
        let fallbacks = uniq([...(cur.fallbacks ?? [])]);

        if (preferred !== next.preferred) {
            fallbacks = uniq(
                [preferred, ...fallbacks, ...(next.fallbacks ?? [])].filter(
                    (x) => x !== next.preferred
                )
            );
            preferred = next.preferred;
        } else {
            fallbacks = uniq([...(cur.fallbacks ?? []), ...(next.fallbacks ?? [])]);
        }

        out.elements[key] = {
            ...cur,
            type: cur.type || next.type,
            preferred,
            fallbacks,
            meta: {
                ...(cur.meta ?? {}),
                ...(next.meta ?? {}),
                tag: next.meta?.tag ?? cur.meta?.tag ?? cur.type ?? next.type ?? "element",
            },
        };
    }

    return out;
}

export async function scanPage(opts: ScanPageOptions): Promise<void> {
    const log = opts.log;

    const outDir = opts.outDir ?? PAGE_SCANNER_MAPS_DIR;
    ensureDir(outDir);

    const outFile = path.join(outDir, `${opts.pageKey}.json`);

    log.info(`Connecting to browser: ${opts.connectCdp}`);
    const browser = await chromium.connectOverCDP(opts.connectCdp);

    try {
        const contexts = browser.contexts();
        if (!contexts.length) {
            throw new Error("No browser contexts found via CDP.");
        }

        const ctx = contexts[0];
        const pages = ctx.pages();
        if (!pages.length) {
            throw new Error("No tabs/pages found in the connected browser.");
        }

        const tabIndex = opts.tabIndex ?? 0;
        if (tabIndex < 0 || tabIndex >= pages.length) {
            throw new Error(`tabIndex ${tabIndex} is out of range. Available tabs: ${pages.length}`);
        }

        const page = pages[tabIndex];
        const url = page.url();

        let title: string | undefined;
        try {
            const t = await page.title();
            title = t?.trim() ? t.trim() : undefined;
        } catch {
            title = undefined;
        }

        log.info(`Scanning tab[${tabIndex}]: ${url}${title ? ` (title: ${title})` : ""}`);

        const scanned: ScannedElement[] = await extractDomElements(page);

        const usedKeys = new Set<string>();
        const perBaseCounter = new Map<string, number>();

        const pageMap: PageMap = {
            pageKey: opts.pageKey,
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
            const type = classifyType(el);

            pageMap.elements[finalKey] = {
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

                    // smart-key context meta
                    ownerId: el.ownerId ?? null,
                    ownerLabelText: el.ownerLabelText ?? null,
                    ownerAriaLabel: el.ownerAriaLabel ?? null,
                    isFrameworkSearchInput: el.isFrameworkSearchInput ?? null,
                },
            };

            if (opts.verbose) {
                log.debug(`KEY=${finalKey} type=${type} best=${best.selector} (${best.reason})`);
            }
        }

        log.info(`Elements found: ${Object.keys(pageMap.elements).length}`);

        if (opts.merge) {
            log.info(`Merging into existing mapper (if any): ${outFile}`);
            const existing = safeReadJson<PageMap>(outFile);
            const merged = existing ? mergePageMaps(existing, pageMap) : pageMap;
            fs.writeFileSync(outFile, JSON.stringify(merged, null, 2), "utf8");
            log.info(`Mapper written (merged): ${outFile}`);
        } else {
            fs.writeFileSync(outFile, JSON.stringify(pageMap, null, 2), "utf8");
            log.info(`Mapper written: ${outFile}`);
        }
    } finally {
        // CDP attach: close() detaches Playwright, browser stays open.
        await browser.close();
    }
}