// src/scanner/scanPage.ts
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

import type { PageMap, ScannedElement } from "./types";
import { pickBest } from "./selectorEngine";
import type { Logger } from "./logger";

// Optional: reuse your framework env config for base URL resolution
import { envConfig } from "../config/env";

function isHttpUrl(s: string) {
    return /^https?:\/\//i.test(s);
}

function joinUrl(base: string, urlPath: string) {
    if (base.endsWith("/") && urlPath.startsWith("/")) return base + urlPath.slice(1);
    if (!base.endsWith("/") && !urlPath.startsWith("/")) return base + "/" + urlPath;
    return base + urlPath;
}

function resolveBaseUrl(): string {
    // Highest priority: explicit base for scanning
    if (process.env.SCAN_BASE_URL) return process.env.SCAN_BASE_URL;

    // Next: use your framework envConfig
    const base =
        envConfig.startFrom === "pcw"
            ? (envConfig.pcwUrl ?? "")
            : (envConfig.env?.customerPortalUrl ?? "");

    if (!base) {
        throw new Error(
            "Cannot resolve base URL. Set SCAN_BASE_URL or configure envConfig URLs."
        );
    }
    return base;
}

async function acceptCookiesIfPresent(page: any, log: Logger) {
    const accept = page.getByRole("button", { name: /accept all/i });

    try {
        if (await accept.isVisible({ timeout: 3000 })) {
            log.info("Cookie banner detected. Clicking 'Accept All'...");
            await accept.click();
            await accept.waitFor({ state: "hidden", timeout: 10_000 });
            log.info("Cookie banner dismissed.");
        } else {
            log.debug("Cookie banner not visible.");
        }
    } catch (e: any) {
        log.debug(`Cookie banner check skipped: ${e?.message || e}`);
    }
}

export async function scanPage(opts: {
    pageKey: string;
    url: string;        // absolute OR relative path
    outDir: string;     // where json is written
    headless: boolean;
    log: Logger;
}): Promise<{ outFile: string; map: PageMap }> {
    const { log } = opts;

    const outDirAbs = path.isAbsolute(opts.outDir)
        ? opts.outDir
        : path.join(process.cwd(), opts.outDir);

    fs.mkdirSync(outDirAbs, { recursive: true });

    const fullUrl = isHttpUrl(opts.url) ? opts.url : joinUrl(resolveBaseUrl(), opts.url);

    log.info(`Starting page scan: ${opts.pageKey}`);
    log.info(`Navigating: ${fullUrl}`);
    log.debug(`Output dir: ${outDirAbs}`);
    log.debug(`Headless: ${opts.headless}`);

    const browser = await chromium.launch({ headless: opts.headless });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await page.goto(fullUrl, { waitUntil: "domcontentloaded" });
        await acceptCookiesIfPresent(page, log);

        log.info("Collecting interactive elements...");

        const raw = await page.evaluate(() => {
            const nodes: Element[] = [];
            const add = (els: NodeListOf<Element>) => els.forEach((e) => nodes.push(e));

            add(document.querySelectorAll("button"));
            add(document.querySelectorAll("a[href]"));
            add(document.querySelectorAll("input"));
            add(document.querySelectorAll("select"));
            add(document.querySelectorAll("textarea"));
            add(document.querySelectorAll("[role]"));

            const uniq = Array.from(new Set(nodes));

            const getText = (el: Element) => {
                const t = (el as any).innerText ?? el.textContent ?? "";
                return String(t).trim().replace(/\s+/g, " ").slice(0, 200);
            };

            const getName = (el: Element) => {
                const aria = el.getAttribute("aria-label");
                if (aria && aria.trim()) return aria.trim().slice(0, 200);

                const id = el.getAttribute("id");
                if (id) {
                    const lbl = document.querySelector(`label[for="${CSS.escape(id)}"]`);
                    const lt = lbl ? getText(lbl) : "";
                    if (lt) return lt;
                }
                return "";
            };

            return uniq
                .filter((el) => {
                    const tag = el.tagName.toLowerCase();
                    const r = (el as HTMLElement).getBoundingClientRect?.();
                    const visible = r ? r.width > 1 && r.height > 1 : true;

                    const hasRole = !!el.getAttribute("role");
                    const isInteractive =
                        tag === "button" ||
                        tag === "a" ||
                        tag === "input" ||
                        tag === "select" ||
                        tag === "textarea";

                    return visible && (isInteractive || hasRole);
                })
                .map((el) => {
                    const tag = el.tagName.toLowerCase();
                    const role = el.getAttribute("role");
                    const id = el.getAttribute("id");
                    const href = el.getAttribute("href");

                    const dataTestId = el.getAttribute("data-testid");
                    const dataTest = el.getAttribute("data-test");
                    const dataQa = el.getAttribute("data-qa");

                    const name = getName(el) || "";
                    const text = getText(el) || "";

                    return {
                        tag,
                        role,
                        id,
                        href,
                        dataTestId,
                        dataTest,
                        dataQa,
                        name: name || null,
                        text: text || null,
                    };
                });
        });

        const elements: ScannedElement[] = (raw as any[]).map((r) => ({
            tag: r.tag,
            role: r.role ?? null,
            id: r.id ?? null,
            name: r.name ?? null,
            text: r.text ?? null,
            href: r.href ?? null,
            dataTestId: r.dataTestId ?? null,
            dataTest: r.dataTest ?? null,
            dataQa: r.dataQa ?? null,
            candidates: [],
            key: "tmp",
        }));

        log.info(`Elements discovered: ${elements.length}`);
        log.debug("Processing selector candidates...");

        const processed = elements.map((e) => pickBest(e));

        // Build page-map (de-dupe keys; if collision append _2, _3, etc.)
        const used = new Map<string, number>();
        const mapElements: PageMap["elements"] = {};

        for (const e of processed) {
            if (!e.best) continue;

            const baseKey = e.key;
            const n = (used.get(baseKey) ?? 0) + 1;
            used.set(baseKey, n);

            const finalKey = n === 1 ? baseKey : `${baseKey}_${n}`;

            mapElements[finalKey] = {
                type: (e.role ?? e.tag ?? "element").toLowerCase(),
                preferred: e.best.selector,
                fallbacks: e.candidates.slice(1, 4).map((c) => c.selector),
                meta: {
                    tag: e.tag,
                    role: e.role,
                    id: e.id,
                    name: e.name,
                    text: e.text,
                },
            };
        }

        const pageMap: PageMap = {
            pageKey: opts.pageKey,
            url: fullUrl,
            urlPath: isHttpUrl(opts.url) ? undefined : opts.url,
            scannedAt: new Date().toISOString(),
            elements: mapElements,
        };

        const outFile = path.join(outDirAbs, `${opts.pageKey}.json`);
        fs.writeFileSync(outFile, JSON.stringify(pageMap, null, 2), "utf-8");

        log.info(`Page map written: ${outFile}`);
        log.info(`Keys written: ${Object.keys(mapElements).length}`);
        log.info("Done ✅");

        return { outFile, map: pageMap };
    } finally {
        await browser.close();
    }
}