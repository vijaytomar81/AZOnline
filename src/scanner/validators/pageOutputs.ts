// src/scanner/validators/pageOutputs.ts

import fs from "node:fs";
import path from "node:path";

import type { PageMap } from "../elements-generator/types";
import { validateAliasCoverage } from "./aliasCoverage";

export type ValidateResult = {
    ok: boolean;
    errors: string[];
    warnings: string[];
};

function safeReadJson<T>(filePath: string): T | null {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function pageKeyToFolder(pagesDir: string, pageKey: string) {
    return path.join(pagesDir, ...pageKey.split("."));
}

function toPascal(s: string) {
    return s
        .replace(/[-_.]/g, " ")
        .split(" ")
        .filter(Boolean)
        .map((p) => p[0].toUpperCase() + p.slice(1))
        .join("");
}

function pageKeyToPageClassFile(pageKey: string) {
    const lastSeg = pageKey.split(".").slice(-1)[0] || "page";
    return `${toPascal(lastSeg)}Page.ts`;
}

function stripLineComments(ts: string) {
    return ts.replace(/\/\/.*$/gm, "");
}

function extractTopLevelObjectKeys(ts: string, objectName: string): string[] {
    const re = new RegExp(
        `export\\s+const\\s+${objectName}\\s*=\\s*\\{([\\s\\S]*?)\\}\\s+as\\s+const;`,
        "m"
    );
    const m = ts.match(re);
    if (!m) return [];

    const body = m[1] ?? "";
    const keys: string[] = [];

    const keyRe = /^\s{2}([A-Za-z_$][A-Za-z0-9_$]*|"[^"]+")\s*:/gm;

    let km: RegExpExecArray | null;
    while ((km = keyRe.exec(body))) {
        let k = km[1] ?? "";
        if (k.startsWith('"') && k.endsWith('"')) k = k.slice(1, -1);
        keys.push(k);
    }

    return Array.from(new Set(keys));
}

function extractPageMeta(ts: string): {
    hasPageMeta: boolean;
    hasUrlRe: boolean;
    hasUrlPath: boolean;
} {
    const hasPageMeta = /export\s+const\s+pageMeta\s*=/.test(ts);
    const hasUrlRe =
        /urlRe\s*:\s*\/.*\/[gimsuy]*/.test(ts) || /urlRe\s*:\s*new\s+RegExp\(/.test(ts);
    const hasUrlPath = /urlPath\s*:\s*["']\//.test(ts);
    return { hasPageMeta, hasUrlRe, hasUrlPath };
}

/**
 * Extract aliases object body from:
 *   export const aliases = { ... } <anything>;
 *
 * Works with:
 * - } as Record<string, ElementKey>;
 * - } as const satisfies Record<string, ElementKey>;
 * - } as const;
 */
function extractAliasesObjectBody(ts: string): string | null {
    const cleaned = stripLineComments(ts);
    const anchor = cleaned.indexOf("export const aliases");
    if (anchor < 0) return null;

    const braceStart = cleaned.indexOf("{", anchor);
    if (braceStart < 0) return null;

    let depth = 0;
    for (let i = braceStart; i < cleaned.length; i++) {
        const ch = cleaned[i];
        if (ch === "{") depth++;
        if (ch === "}") {
            depth--;
            if (depth === 0) {
                return cleaned.slice(braceStart + 1, i);
            }
        }
    }
    return null;
}

/**
 * Ensures aliases.ts RHS targets are valid ElementKey.
 * Accepts:
 *   foo: aliasesGenerated.bar,
 *   foo: "bar",
 */
function checkAliasesHumanPointers(
    aliasesHumanTs: string,
    elementKeys: Set<string>
): { errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    const body = extractAliasesObjectBody(aliasesHumanTs);
    if (!body) {
        warnings.push(`aliases.ts: could not parse "export const aliases = { ... }".`);
        return { errors, warnings };
    }

    const cleaned = stripLineComments(body);

    const pairRe = /^\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*:\s*([^,]+)\s*,?\s*$/gm;

    let m: RegExpExecArray | null;
    while ((m = pairRe.exec(cleaned))) {
        const aliasKey = m[1]?.trim();
        const rhs = m[2]?.trim() ?? "";
        if (!aliasKey) continue;

        const ag = rhs.match(/^aliasesGenerated\.([A-Za-z_$][A-Za-z0-9_$]*)$/);
        if (ag) {
            const target = ag[1]!;
            if (!elementKeys.has(target)) {
                errors.push(
                    `aliases.ts: alias "${aliasKey}" points to aliasesGenerated.${target} but "${target}" is not an ElementKey.`
                );
            }
            continue;
        }

        const lit = rhs.match(/^"([^"]+)"$/);
        if (lit) {
            const target = lit[1]!;
            if (!elementKeys.has(target)) {
                errors.push(
                    `aliases.ts: alias "${aliasKey}" points to "${target}" but "${target}" is not an ElementKey.`
                );
            }
            continue;
        }

        warnings.push(
            `aliases.ts: alias "${aliasKey}" value not recognized (${rhs}). Skipping strict validation.`
        );
    }

    return { errors, warnings };
}

export function validateOnePage(params: {
    mapsDir: string;
    pagesDir: string;
    mapFile: string;
}): ValidateResult {
    const { mapsDir, pagesDir, mapFile } = params;

    const errors: string[] = [];
    const warnings: string[] = [];

    const mapPath = path.join(mapsDir, mapFile);
    const pageMap = safeReadJson<PageMap>(mapPath);

    if (!pageMap)
        return { ok: false, errors: [`Could not read page-map: ${mapFile}`], warnings: [] };
    if (!pageMap.pageKey)
        return { ok: false, errors: [`Invalid page-map (missing pageKey): ${mapFile}`], warnings: [] };

    const folder = pageKeyToFolder(pagesDir, pageMap.pageKey);
    const elementsPath = path.join(folder, "elements.ts");
    const aliasesGenPath = path.join(folder, "aliases.generated.ts");
    const aliasesHumanPath = path.join(folder, "aliases.ts");
    const pageTsPath = path.join(folder, pageKeyToPageClassFile(pageMap.pageKey));

    // existence checks
    for (const fp of [elementsPath, aliasesGenPath, aliasesHumanPath, pageTsPath]) {
        if (!fs.existsSync(fp)) {
            errors.push(`Missing generated file: ${path.relative(process.cwd(), fp)}`);
        }
    }
    if (errors.length) return { ok: false, errors, warnings };

    const pageMapKeys = Object.keys(pageMap.elements).sort((a, b) => a.localeCompare(b));
    const elementsTs = fs.readFileSync(elementsPath, "utf8");
    const aliasesGenTs = fs.readFileSync(aliasesGenPath, "utf8");
    const aliasesHumanTs = fs.readFileSync(aliasesHumanPath, "utf8");
    const pageTs = fs.readFileSync(pageTsPath, "utf8");

    // elements.ts keys
    const elementsKeys = extractTopLevelObjectKeys(elementsTs, "elements").sort((a, b) =>
        a.localeCompare(b)
    );
    if (elementsKeys.length === 0) {
        errors.push(`elements.ts: could not extract keys from "export const elements".`);
    } else {
        const mapSet = new Set(pageMapKeys);
        const elSet = new Set(elementsKeys);

        const missing = pageMapKeys.filter((k) => !elSet.has(k));
        const extra = elementsKeys.filter((k) => !mapSet.has(k));

        if (missing.length) errors.push(`elements.ts: missing keys: ${missing.join(", ")}`);
        if (extra.length)
            warnings.push(`elements.ts: extra keys not in page-map (maybe stale): ${extra.join(", ")}`);
    }

    // aliases.generated.ts keys + pageMeta
    const aliasesGenKeys = extractTopLevelObjectKeys(aliasesGenTs, "aliasesGenerated").sort(
        (a, b) => a.localeCompare(b)
    );
    if (aliasesGenKeys.length === 0) {
        errors.push(`aliases.generated.ts: could not extract keys from "export const aliasesGenerated".`);
    } else {
        const mapSet = new Set(pageMapKeys);
        const agSet = new Set(aliasesGenKeys);

        const missing = pageMapKeys.filter((k) => !agSet.has(k));
        const extra = aliasesGenKeys.filter((k) => !mapSet.has(k));

        if (missing.length) errors.push(`aliases.generated.ts: missing keys: ${missing.join(", ")}`);
        if (extra.length)
            warnings.push(
                `aliases.generated.ts: extra keys not in page-map (maybe stale): ${extra.join(", ")}`
            );
    }

    const meta = extractPageMeta(aliasesGenTs);
    if (!meta.hasPageMeta) {
        errors.push(`aliases.generated.ts: missing "export const pageMeta = { ... }".`);
    } else if (pageMap.urlPath) {
        if (!meta.hasUrlPath) {
            errors.push(`aliases.generated.ts: pageMeta missing "urlPath" although page-map has urlPath.`);
        }
        if (!meta.hasUrlRe) {
            warnings.push(
                `aliases.generated.ts: pageMeta missing "urlRe". Recommended for stable waitForURL; page-map urlPath=${pageMap.urlPath}`
            );
        }
    }

    // aliases.ts pointers must resolve to ElementKey
    const elSet = new Set(elementsKeys);
    const aliPointerCheck = checkAliasesHumanPointers(aliasesHumanTs, elSet);
    errors.push(...aliPointerCheck.errors);
    warnings.push(...aliPointerCheck.warnings);

    // coverage + usage checks (aliases.ts <-> page object)
    if (aliasesGenKeys.length) {
        const cov = validateAliasCoverage({
            pageKey: pageMap.pageKey,
            aliasesGeneratedKeys: aliasesGenKeys,
            aliasesHumanTs,
            pageObjectTs: pageTs,
            pageObjectFileName: path.basename(pageTsPath),
        });
        errors.push(...cov.errors);
        warnings.push(...cov.warnings);
    }

    return { ok: errors.length === 0, errors, warnings };
}