// src/scanner/scanPage.ts

import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

import type { Logger } from "./logger";
import type { PageMap, ScannedElement } from "./types";
import { buildCandidates } from "./selectorEngine";

export type ScanPageOptions = {
    connectCdp: string;
    pageKey: string;
    outDir?: string;
    merge?: boolean;
    tabIndex?: number;
    verbose?: boolean;
    log: Logger;
};

function nowIso() {
    return new Date().toISOString();
}

function ensureDir(dir: string) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function toCamelFromText(s: string) {
    const cleaned = s
        .trim()
        .toLowerCase()
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        .replace(/[^a-z0-9]+/g, " ")
        .trim();

    if (!cleaned) return "";

    const parts = cleaned.split(/\s+/g);
    return parts
        .map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)))
        .join("");
}

function capFirst(s: string) {
    if (!s) return s;
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function uniqueKey(base: string, used: Set<string>) {
    let key = base;
    let i = 2;
    while (!key || used.has(key)) {
        key = `${base}${i}`;
        i++;
    }
    used.add(key);
    return key;
}

/**
 * Label-first key strategy (fallback):
 * labelText -> ariaLabel -> visible text -> placeholder -> inputName -> name -> id -> tag+index
 */
function buildLabelFirstKey(el: ScannedElement, indexHint: number) {
    const candidates = [
        el.labelText,
        el.ariaLabel,
        el.text,
        el.placeholder,
        el.inputName,
        el.name,
        el.id,
    ].filter(Boolean) as string[];

    const best = candidates[0] ?? `${el.tag}-${indexHint}`;
    return toCamelFromText(best);
}

/**
 * ✅ Enterprise key strategy (#1):
 * For radio/checkbox groups, include group name (inputName) + option label.
 *
 * Examples:
 *  - registrationNumberPolarQuestionYes
 *  - vehicleDetailsSetCorrectlyNo
 */
function buildEnterpriseKey(el: ScannedElement, indexHint: number) {
    const type = (el.typeAttr ?? "").toLowerCase();
    const isGrouped = type === "radio" || type === "checkbox";

    if (isGrouped && el.inputName) {
        const group = toCamelFromText(el.inputName) || "group";
        const optionLabel =
            toCamelFromText(el.labelText ?? "") ||
            toCamelFromText(el.ariaLabel ?? "") ||
            toCamelFromText(el.text ?? "") ||
            toCamelFromText(el.name ?? "") ||
            `option${indexHint}`;

        return `${group}${capFirst(optionLabel || `option${indexHint}`)}`;
    }

    // default
    return buildLabelFirstKey(el, indexHint);
}

function classifyType(el: ScannedElement) {
    const tag = (el.tag || "").toLowerCase();
    const role = (el.role || "").toLowerCase();
    const type = (el.typeAttr || "").toLowerCase();

    if (tag === "button" || role === "button") return "button";
    if (tag === "a" || role === "link") return "link";
    if (tag === "select" || role === "combobox") return "select";
    if (tag === "textarea") return "textarea";
    if (tag === "input") {
        if (type === "checkbox") return "checkbox";
        if (type === "radio") return "radio";
        return "input";
    }
    return role || tag || "element";
}

function uniq(arr: string[]) {
    return Array.from(new Set(arr.filter(Boolean)));
}

function safeReadJson<T>(filePath: string): T | null {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

/** Build a stable identity signature for collision-safe merge (#3) */
function identitySig(e: PageMap["elements"][string]) {
    const m: NonNullable<PageMap["elements"][string]["meta"]> = (e.meta ?? { tag: "element" }) as NonNullable<
        PageMap["elements"][string]["meta"]
    >;

    const parts = [
        `type=${e.type ?? ""}`,
        `tag=${m.tag ?? ""}`,
        `inputName=${m.inputName ?? ""}`,
        `id=${m.id ?? ""}`,
        `dataTestId=${m.dataTestId ?? ""}`,
        `dataQa=${m.dataQa ?? ""}`,
        `dataTest=${m.dataTest ?? ""}`,
        `href=${m.href ?? ""}`,
    ];

    return parts.join("|");
}

/**
 * ✅ Merge strategy (#3):
 * - Keep existing keys stable.
 * - If same key but identity differs => DO NOT overwrite.
 *   Instead create a new key (key2/key3) and append.
 * - If same identity => normal merge:
 *   preferred promotion + fallbacks union + meta merge.
 */
function mergePageMaps(existing: PageMap, incoming: PageMap): PageMap {
    const out: PageMap = {
        ...existing,
        pageKey: existing.pageKey || incoming.pageKey,
        url: incoming.url || existing.url,
        urlPath: incoming.urlPath ?? existing.urlPath,
        scannedAt: incoming.scannedAt,
        elements: { ...existing.elements },
    };

    const usedKeys = new Set(Object.keys(out.elements));

    for (const [key, next] of Object.entries(incoming.elements)) {
        const cur = out.elements[key];

        // new key entirely
        if (!cur) {
            out.elements[key] = next;
            usedKeys.add(key);
            continue;
        }

        // collision-safe check
        const curSig = identitySig(cur);
        const nextSig = identitySig(next);

        if (curSig !== nextSig) {
            // same label key but different underlying element => append instead of overwrite
            const newKey = uniqueKey(key, usedKeys);
            out.elements[newKey] = next;
            continue;
        }

        // same identity => normal merge
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

    const outDir = opts.outDir ?? path.join(process.cwd(), "src", "page-maps");
    ensureDir(outDir);

    const outFile = path.join(outDir, `${opts.pageKey}.json`);

    log.info(`Connecting to browser: ${opts.connectCdp}`);

    const browser = await chromium.connectOverCDP(opts.connectCdp);

    try {
        const contexts = browser.contexts();
        if (!contexts.length) throw new Error("No browser contexts found via CDP.");

        const ctx = contexts[0];
        const pages = ctx.pages();
        if (!pages.length) throw new Error("No tabs/pages found in the connected browser.");

        const tabIndex = opts.tabIndex ?? 0;
        if (tabIndex < 0 || tabIndex >= pages.length) {
            throw new Error(`tabIndex ${tabIndex} is out of range. Available tabs: ${pages.length}`);
        }

        const page = pages[tabIndex];
        const url = page.url();

        log.info(`Scanning tab[${tabIndex}]: ${url}`);

        const scanned: ScannedElement[] = await page.evaluate(() => {
            function getAttr(el: Element, name: string): string | null {
                const v = el.getAttribute(name);
                return v && v.trim() ? v.trim() : null;
            }

            function safeText(s: string | null | undefined): string | null {
                const t = (s ?? "").trim();
                return t ? t : null;
            }

            function labelFromForId(id: string): string | null {
                const lbl = document.querySelector(`label[for='${CSS.escape(id)}']`);
                return safeText(lbl?.textContent ?? null);
            }

            function labelFromWrap(el: Element): string | null {
                const lbl = el.closest("label");
                return safeText(lbl?.textContent ?? null);
            }

            function labelFromAriaLabelledBy(el: Element): string | null {
                const ids = getAttr(el, "aria-labelledby");
                if (!ids) return null;
                const parts = ids.split(/\s+/g).filter(Boolean);
                const texts = parts
                    .map((id) => document.getElementById(id)?.textContent ?? "")
                    .map((t) => t.trim())
                    .filter(Boolean);
                return texts.length ? texts.join(" ") : null;
            }

            function inferLabelText(el: Element): string | null {
                const id = getAttr(el, "id");
                if (id) {
                    const f = labelFromForId(id);
                    if (f) return f;
                }
                const aria = labelFromAriaLabelledBy(el);
                if (aria) return aria;

                const wrap = labelFromWrap(el);
                if (wrap) return wrap;

                return null;
            }

            function elementText(el: Element): string | null {
                const tag = el.tagName.toLowerCase();
                if (tag === "button" || tag === "a") {
                    return safeText(el.textContent ?? null);
                }
                return null;
            }

            const selector = [
                "input",
                "select",
                "textarea",
                "button",
                "a[href]",
                "[role='button']",
                "[role='link']",
                "[role='textbox']",
                "[role='combobox']",
                "[data-testid]",
                "[data-test]",
                "[data-qa]",
            ].join(",");

            const root = document.querySelector("#root");

            // If #root is missing for some reason, fall back to the whole document
            const scope: ParentNode = root ?? document;

            const nodes = Array.from(scope.querySelectorAll(selector))
                // ✅ Exclude anything inside <footer>
                .filter((el) => !el.closest("footer"));

            return nodes.map((el) => {
                const tag = el.tagName.toLowerCase();
                const role = getAttr(el, "role");
                const id = getAttr(el, "id");
                const nameAttr = getAttr(el, "name");
                const placeholder = getAttr(el, "placeholder");
                const ariaLabel = getAttr(el, "aria-label");
                const labelText = inferLabelText(el);
                const text = elementText(el);

                const href = tag === "a" ? getAttr(el, "href") : null;

                const dataTestId = getAttr(el, "data-testid");
                const dataTest = getAttr(el, "data-test");
                const dataQa = getAttr(el, "data-qa");

                const typeAttr = tag === "input" ? getAttr(el, "type") : null;

                const derivedName =
                    ariaLabel || labelText || text || placeholder || nameAttr || id || null;

                return {
                    tag,
                    role,
                    id,
                    name: derivedName,
                    text,
                    href,
                    dataTestId,
                    dataTest,
                    dataQa,
                    labelText,
                    ariaLabel,
                    placeholder,
                    inputName: nameAttr,
                    typeAttr,
                    valueAttr: null,
                    candidates: [],
                    key: "",
                } as ScannedElement;
            });
        });

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
            elements: {},
        };

        for (let idx = 0; idx < scanned.length; idx++) {
            const el = scanned[idx];

            // ✅ NEW: enterprise key builder (#1)
            const baseKey = buildEnterpriseKey(el, idx + 1);

            const bump = (perBaseCounter.get(baseKey) ?? 0) + 1;
            perBaseCounter.set(baseKey, bump);

            const finalKey = uniqueKey(bump === 1 ? baseKey : `${baseKey}${bump}`, usedKeys);

            const cands = buildCandidates(el);
            const best = cands[0];
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

                    // ✅ add these so merge can detect identity changes (#3)
                    href: el.href ?? null,
                    dataTestId: el.dataTestId ?? null,
                    dataTest: el.dataTest ?? null,
                    dataQa: el.dataQa ?? null,
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