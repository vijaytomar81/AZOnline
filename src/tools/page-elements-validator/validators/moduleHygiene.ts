// src/tools/page-elements-validator/validators/moduleHygiene.ts

import fs from "node:fs";
import path from "node:path";

import { fileLooksLikeModule } from "../../../utils/text";
import { PAGES_DIR, PAGE_SCANNER_DIR } from "../../../utils/paths";

export type HygieneResult = {
    errors: string[];
    warnings: string[];
};

function resolveTsModuleTarget(fromFile: string, spec: string): string | null {
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
 * Checks selected files under src/pages for broken local imports/exports
 * and invalid TypeScript module targets.
 *
 * Current scope:
 * - src/pages/index.ts
 * - src/pages/pageManager.ts
 */
export function checkPagesModuleHygiene(pagesDir: string = PAGES_DIR): HygieneResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const filesToCheck = [
        path.join(pagesDir, "index.ts"),
        path.join(pagesDir, "pageManager.ts"),
    ];

    for (const file of filesToCheck) {
        if (!fs.existsSync(file)) {
            warnings.push(
                `pages module hygiene: missing ${path.relative(process.cwd(), file)} (skipping).`
            );
            continue;
        }

        const text = fs.readFileSync(file, "utf8");

        // Matches:
        //   export * from "./x";
        //   export { X } from "./x";
        //   import { X } from "./x";
        const moduleRefRegex =
            /^\s*(export\s+\*\s+from|export\s+.*?\s+from|import\s+.*?\s+from)\s+["']([^"']+)["'];?\s*$/gm;

        let match: RegExpExecArray | null;

        while ((match = moduleRefRegex.exec(text))) {
            const spec = match[2] ?? "";
            const resolved = resolveTsModuleTarget(file, spec);

            // Ignore package imports
            if (!resolved) continue;

            if (!fs.existsSync(resolved)) {
                errors.push(
                    `pages module hygiene: ${path.relative(
                        process.cwd(),
                        file
                    )} references "${spec}" but target file was not found. Expected a file like ${path.relative(
                        process.cwd(),
                        resolved
                    )}.`
                );
                continue;
            }

            const targetText = fs.readFileSync(resolved, "utf8");

            if (!fileLooksLikeModule(targetText)) {
                errors.push(
                    `pages module hygiene: ${path.relative(
                        process.cwd(),
                        file
                    )} references "${spec}" but ${path.relative(
                        process.cwd(),
                        resolved
                    )} is not a TypeScript module (no import/export found).`
                );
            }
        }
    }

    return { errors, warnings };
}

/**
 * Checks page-scanner module hygiene for stale or legacy exports in:
 * - src/tools/page-scanner/index.ts
 *
 * This is intentionally narrow and only flags known legacy symbols.
 */
export function checkPageScannerModuleHygiene(): HygieneResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const scannerIndex = path.join(PAGE_SCANNER_DIR, "index.ts");

    if (!fs.existsSync(scannerIndex)) {
        warnings.push(
            `page-scanner module hygiene: missing ${path.relative(
                process.cwd(),
                scannerIndex
            )} (skipping).`
        );
        return { errors, warnings };
    }

    const text = fs.readFileSync(scannerIndex, "utf8");

    if (/\bgenerateElements\b/.test(text)) {
        errors.push(
            `page-scanner module hygiene: ${path.relative(
                process.cwd(),
                scannerIndex
            )} references legacy symbol "generateElements" (should not).`
        );
    }

    if (/\bselectorEngine\b/.test(text)) {
        errors.push(
            `page-scanner module hygiene: ${path.relative(
                process.cwd(),
                scannerIndex
            )} references legacy symbol "selectorEngine" (should not).`
        );
    }

    return { errors, warnings };
}