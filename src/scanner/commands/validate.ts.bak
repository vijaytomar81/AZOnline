// src/scanner/commands/validate.ts

import fs from "node:fs";
import path from "node:path";
import { createLogger } from "../logger";

type PageMap = {
    pageKey: string;
    scannedAt?: string;
    url?: string;
    urlPath?: string;
    elements: Record<
        string,
        {
            type: string;
            preferred: string;
            fallbacks: string[];
            meta?: any;
        }
    >;
};

type ValidateResult = {
    ok: boolean;
    errors: string[];
    warnings: string[];
};

function getArg(argv: string[], name: string): string | undefined {
    const i = argv.indexOf(name);
    if (i >= 0) return argv[i + 1];

    const eq = argv.find((a) => a.startsWith(`${name}=`));
    if (eq) return eq.split("=").slice(1).join("=");

    return undefined;
}

function hasFlag(argv: string[], name: string): boolean {
    return argv.includes(name);
}

function safeReadText(filePath: string): string | null {
    if (!fs.existsSync(filePath)) return null;
    return fs.readFileSync(filePath, "utf8");
}

function safeReadJson<T>(filePath: string): T | null {
    const txt = safeReadText(filePath);
    if (!txt) return null;
    return JSON.parse(txt) as T;
}

function listPageMapFiles(mapsDir: string): string[] {
    if (!fs.existsSync(mapsDir)) return [];
    return fs
        .readdirSync(mapsDir)
        .filter((f) => f.endsWith(".json") && !f.startsWith("."))
        .sort((a, b) => a.localeCompare(b));
}

function pageKeyToFolder(pagesDir: string, pageKey: string) {
    // motor.car-details -> src/pages/motor/car-details/
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

function extractTopLevelObjectKeys(ts: string, objectName: string): string[] {
    // Very lightweight parser for:
    // export const elements = { ... } as const;
    // export const aliasesGenerated = { ... } as const;
    //
    // We only need top-level keys, and your generator emits a stable simple structure.
    const re = new RegExp(
        `export\\s+const\\s+${objectName}\\s*=\\s*\\{([\\s\\S]*?)\\}\\s+as\\s+const;`,
        "m"
    );
    const m = ts.match(re);
    if (!m) return [];

    const body = m[1] ?? "";
    const keys: string[] = [];

    // Matches:
    //   foo:
    //   "foo-bar":
    //
    // Avoid matching nested keys by restricting to start of line and indentation of two spaces.
    const keyRe = /^\s{2}([A-Za-z_$][A-Za-z0-9_$]*|"[^"]+")\s*:/gm;

    let km: RegExpExecArray | null;
    while ((km = keyRe.exec(body))) {
        let k = km[1] ?? "";
        if (k.startsWith('"') && k.endsWith('"')) k = k.slice(1, -1);
        keys.push(k);
    }

    return Array.from(new Set(keys));
}

function extractPageMeta(ts: string): { hasPageMeta: boolean; hasUrlRe: boolean; hasUrlPath: boolean } {
    const hasPageMeta = /export\s+const\s+pageMeta\s*=/.test(ts);
    const hasUrlRe = /urlRe\s*:\s*\/.*\/[gimsuy]*/.test(ts) || /urlRe\s*:\s*new\s+RegExp\(/.test(ts);
    const hasUrlPath = /urlPath\s*:\s*["']\//.test(ts);
    return { hasPageMeta, hasUrlRe, hasUrlPath };
}

function checkAliasesHuman(aliasesHumanTs: string, elementKeys: Set<string>): { errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // We accept these forms:
    //   foo: aliasesGenerated.next,
    //   foo: "next",
    //
    // We ignore anything we can't confidently parse (warn, not fail).
    const bodyMatch = aliasesHumanTs.match(/export\s+const\s+aliases\s*=\s*\{([\s\S]*?)\}\s+as\s+Record</m);
    if (!bodyMatch) {
        warnings.push(`aliases.ts: could not parse "export const aliases = { ... }".`);
        return { errors, warnings };
    }

    const body = bodyMatch[1] ?? "";

    // Strip line comments to avoid false hits.
    const cleaned = body.replace(/\/\/.*$/gm, "");

    // Match `key: value,`
    const pairRe = /^\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*:\s*([^,]+)\s*,?\s*$/gm;

    let m: RegExpExecArray | null;
    while ((m = pairRe.exec(cleaned))) {
        const aliasKey = m[1]?.trim();
        const rhs = m[2]?.trim() ?? "";

        if (!aliasKey) continue;

        // aliasesGenerated.foo
        const ag = rhs.match(/^aliasesGenerated\.([A-Za-z_$][A-Za-z0-9_$]*)$/);
        if (ag) {
            const target = ag[1]!;
            if (!elementKeys.has(target)) {
                errors.push(`aliases.ts: alias "${aliasKey}" points to aliasesGenerated.${target} but "${target}" is not an ElementKey.`);
            }
            continue;
        }

        // "foo"
        const lit = rhs.match(/^"([^"]+)"$/);
        if (lit) {
            const target = lit[1]!;
            if (!elementKeys.has(target)) {
                errors.push(`aliases.ts: alias "${aliasKey}" points to "${target}" but "${target}" is not an ElementKey.`);
            }
            continue;
        }

        warnings.push(`aliases.ts: alias "${aliasKey}" value not recognized (${rhs}). Skipping strict validation.`);
    }

    return { errors, warnings };
}

function resolveTsImportTarget(fromFile: string, spec: string): string | null {
    // local-only targets: "./x", "../x"
    if (!spec.startsWith(".")) return null;

    const base = path.resolve(path.dirname(fromFile), spec);

    const candidates = [
        `${base}.ts`,
        `${base}.tsx`,
        path.join(base, "index.ts"),
        path.join(base, "index.tsx"),
    ];

    for (const c of candidates) {
        if (fs.existsSync(c)) return c;
    }
    return candidates[0] ?? null;
}

function fileLooksLikeModule(tsText: string): boolean {
    // crude but good enough: if it contains an export/import it is a module
    return /\bexport\b|\bimport\b/.test(tsText);
}

function checkExportsIndexHygiene(pagesDir: string): { errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    const candidates = [
        path.join(pagesDir, "index.ts"),
        path.join(pagesDir, "pageManager.ts"),
    ];

    for (const f of candidates) {
        if (!fs.existsSync(f)) {
            warnings.push(`pages hygiene: missing ${path.relative(process.cwd(), f)} (skipping).`);
            continue;
        }

        const txt = fs.readFileSync(f, "utf8");

        // Match lines like: export { X } from "./motor/foo/FooPage";
        // Or: import { X } from "./motor/foo/FooPage";
        const re = /^\s*(export|import)\s+.*?\s+from\s+["']([^"']+)["'];?\s*$/gm;

        let m: RegExpExecArray | null;
        while ((m = re.exec(txt))) {
            const spec = m[2] ?? "";
            const resolved = resolveTsImportTarget(f, spec);

            if (!resolved) continue; // external import, ignore
            if (!fs.existsSync(resolved)) {
                errors.push(
                    `pages hygiene: ${path.relative(process.cwd(), f)} references "${spec}" but target file not found. Expected like: ${path.relative(
                        process.cwd(),
                        resolved
                    )}`
                );
                continue;
            }

            const targetTxt = fs.readFileSync(resolved, "utf8");
            if (!fileLooksLikeModule(targetTxt)) {
                errors.push(
                    `pages hygiene: ${path.relative(process.cwd(), f)} references "${spec}" but ${path.relative(
                        process.cwd(),
                        resolved
                    )} is not a TS module (no import/export).`
                );
            }
        }
    }

    return { errors, warnings };
}

function validateOnePage(mapsDir: string, pagesDir: string, mapFile: string): ValidateResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const mapPath = path.join(mapsDir, mapFile);
    const pageMap = safeReadJson<PageMap>(mapPath);

    if (!pageMap) return { ok: false, errors: [`Could not read page-map: ${mapFile}`], warnings: [] };
    if (!pageMap.pageKey) return { ok: false, errors: [`Invalid page-map (missing pageKey): ${mapFile}`], warnings: [] };

    const folder = pageKeyToFolder(pagesDir, pageMap.pageKey);
    const elementsPath = path.join(folder, "elements.ts");
    const aliasesGenPath = path.join(folder, "aliases.generated.ts");
    const aliasesHumanPath = path.join(folder, "aliases.ts");
    const pageTsPath = path.join(folder, pageKeyToPageClassFile(pageMap.pageKey));

    // Existence checks
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

    // elements.ts keys
    const elementsKeys = extractTopLevelObjectKeys(elementsTs, "elements").sort((a, b) => a.localeCompare(b));
    if (elementsKeys.length === 0) {
        errors.push(`elements.ts: could not extract keys from "export const elements".`);
    } else {
        const a = new Set(pageMapKeys);
        const b = new Set(elementsKeys);

        const missingInElements = pageMapKeys.filter((k) => !b.has(k));
        const extraInElements = elementsKeys.filter((k) => !a.has(k));

        if (missingInElements.length) {
            errors.push(`elements.ts: missing keys: ${missingInElements.join(", ")}`);
        }
        if (extraInElements.length) {
            warnings.push(`elements.ts: extra keys not in page-map (maybe stale): ${extraInElements.join(", ")}`);
        }
    }

    // aliases.generated.ts keys + pageMeta
    const aliasesGenKeys = extractTopLevelObjectKeys(aliasesGenTs, "aliasesGenerated").sort((a, b) => a.localeCompare(b));
    if (aliasesGenKeys.length === 0) {
        errors.push(`aliases.generated.ts: could not extract keys from "export const aliasesGenerated".`);
    } else {
        const a = new Set(pageMapKeys);
        const b = new Set(aliasesGenKeys);

        const missingInAliasesGen = pageMapKeys.filter((k) => !b.has(k));
        const extraInAliasesGen = aliasesGenKeys.filter((k) => !a.has(k));

        if (missingInAliasesGen.length) {
            errors.push(`aliases.generated.ts: missing keys: ${missingInAliasesGen.join(", ")}`);
        }
        if (extraInAliasesGen.length) {
            warnings.push(`aliases.generated.ts: extra keys not in page-map (maybe stale): ${extraInAliasesGen.join(", ")}`);
        }
    }

    const meta = extractPageMeta(aliasesGenTs);
    if (!meta.hasPageMeta) {
        errors.push(`aliases.generated.ts: missing "export const pageMeta = { ... }".`);
    } else if (pageMap.urlPath) {
        // If urlPath exists in page-map, we expect urlPath + urlRe in pageMeta
        if (!meta.hasUrlPath) {
            errors.push(`aliases.generated.ts: pageMeta missing "urlPath" although page-map has urlPath.`);
        }
        if (!meta.hasUrlRe) {
            warnings.push(
                `aliases.generated.ts: pageMeta missing "urlRe". Recommended for stable waitForURL; page-map urlPath=${pageMap.urlPath}`
            );
        }
    }

    // aliases.ts business mappings should point to valid ElementKey
    const elSet = new Set(elementsKeys);
    const aliCheck = checkAliasesHuman(aliasesHumanTs, elSet);
    errors.push(...aliCheck.errors);
    warnings.push(...aliCheck.warnings);

    return { ok: errors.length === 0, errors, warnings };
}

export async function runValidateCommand(args: string[]) {
    const verbose = hasFlag(args, "--verbose");
    const strict = hasFlag(args, "--strict");

    const log = createLogger({ prefix: "[scanner]", verbose, withTimestamp: true });
    log.info("Command: validate");

    const mapsDir = getArg(args, "--mapsDir") ?? path.join(process.cwd(), "src", "page-maps");
    const pagesDir = getArg(args, "--pagesDir") ?? path.join(process.cwd(), "src", "pages");

    const checkIndex = !hasFlag(args, "--noIndexHygiene");

    if (!fs.existsSync(mapsDir)) {
        log.error(`mapsDir not found: ${mapsDir}`);
        process.exit(1);
    }
    if (!fs.existsSync(pagesDir)) {
        log.error(`pagesDir not found: ${pagesDir}`);
        process.exit(1);
    }

    const mapFiles = listPageMapFiles(mapsDir);
    log.info(`Found ${mapFiles.length} page-map(s).`);

    let ok = 0;
    let bad = 0;
    let warnCount = 0;

    for (const mf of mapFiles) {
        const res = validateOnePage(mapsDir, pagesDir, mf);

        const pageKey = safeReadJson<PageMap>(path.join(mapsDir, mf))?.pageKey ?? mf.replace(/\.json$/, "");

        if (res.ok) {
            ok++;
            log.info(`✅ ${pageKey} OK`);
        } else {
            bad++;
            log.error(`❌ ${pageKey} FAILED`);
        }

        for (const w of res.warnings) {
            warnCount++;
            if (verbose) log.debug(`WARN: ${pageKey}: ${w}`);
            else log.info(`⚠️  ${pageKey}: ${w}`);
        }

        for (const e of res.errors) {
            log.error(`${pageKey}: ${e}`);
        }
    }

    // index hygiene checks (exports/imports correctness)
    if (checkIndex) {
        const idxRes = checkExportsIndexHygiene(pagesDir);
        warnCount += idxRes.warnings.length;

        for (const w of idxRes.warnings) {
            if (verbose) log.debug(`WARN: ${w}`);
            else log.info(`⚠️  ${w}`);
        }
        for (const e of idxRes.errors) {
            // treat as error always (it breaks build)
            bad++;
            log.error(`❌ ${e}`);
        }
    }

    log.info(`Validate summary: ok=${ok} bad=${bad} warnings=${warnCount}`);

    if (bad > 0) {
        process.exit(1);
    }

    if (strict && warnCount > 0) {
        log.error(`Strict mode: warnings found (${warnCount}).`);
        process.exit(1);
    }
}