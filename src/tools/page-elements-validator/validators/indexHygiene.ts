// src/tools/page-elements-validator/validators/indexHygiene.ts

import fs from "node:fs";
import path from "node:path";
import { fileLooksLikeModule } from "../../../utils/text";

export type HygieneResult = {
    errors: string[];
    warnings: string[];
};

function resolveTsImportTarget(fromFile: string, spec: string): string | null {
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

/**
 * Checks src/pages/index.ts and src/pages/pageManager.ts for broken local imports/exports.
 */
export function checkPagesIndexHygiene(pagesDir: string): HygieneResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const candidates = [
        path.join(pagesDir, "index.ts"),
        path.join(pagesDir, "pageManager.ts"),
    ];

    for (const f of candidates) {
        if (!fs.existsSync(f)) {
            warnings.push(
                `pages hygiene: missing ${path.relative(process.cwd(), f)} (skipping).`
            );
            continue;
        }

        const txt = fs.readFileSync(f, "utf8");

        // export { X } from "./x";
        // import { X } from "./x";
        const re =
            /^\s*(export|import)\s+.*?\s+from\s+["']([^"']+)["'];?\s*$/gm;

        let m: RegExpExecArray | null;
        while ((m = re.exec(txt))) {
            const spec = m[2] ?? "";
            const resolved = resolveTsImportTarget(f, spec);

            if (!resolved) continue; // external import
            if (!fs.existsSync(resolved)) {
                errors.push(
                    `pages hygiene: ${path.relative(
                        process.cwd(),
                        f
                    )} references "${spec}" but target file not found. Expected like: ${path.relative(
                        process.cwd(),
                        resolved
                    )}`
                );
                continue;
            }

            const targetTxt = fs.readFileSync(resolved, "utf8");
            if (!fileLooksLikeModule(targetTxt)) {
                errors.push(
                    `pages hygiene: ${path.relative(
                        process.cwd(),
                        f
                    )} references "${spec}" but ${path.relative(
                        process.cwd(),
                        resolved
                    )} is not a TS module (no import/export).`
                );
            }
        }
    }

    return { errors, warnings };
}

/**
 * Checks src/scanner/index.ts for stale legacy exports.
 */
export function checkScannerIndexHygiene(): HygieneResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const scannerIndex = path.join(process.cwd(), "src", "scanner", "index.ts");

    if (!fs.existsSync(scannerIndex)) {
        warnings.push(
            `scanner hygiene: missing ${path.relative(
                process.cwd(),
                scannerIndex
            )} (skipping).`
        );
        return { errors, warnings };
    }

    const txt = fs.readFileSync(scannerIndex, "utf8");

    if (/\bgenerateElements\b/.test(txt)) {
        errors.push(
            `scanner hygiene: src/scanner/index.ts references legacy "generateElements" (should not).`
        );
    }
    if (/\bselectorEngine\b/.test(txt)) {
        errors.push(
            `scanner hygiene: src/scanner/index.ts references legacy "selectorEngine" (should not).`
        );
    }

    return { errors, warnings };
}