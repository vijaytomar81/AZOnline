// src/tools/page-elements-validator/validators/pageRegistry.ts

import path from "node:path";

import { safeReadText } from "../../../utils/fs";
import { PAGES_DIR } from "../../../utils/paths";
import { toCamelFromText } from "../../../utils/text";
import { toPascal } from "../../../utils/ts";

export type RegistryValidationResult = {
    errors: string[];
    warnings: string[];
};

export type CheckPageRegistryArgs = {
    pageKey: string;          // e.g. "motor.car-details"
    pagesDir?: string;        // default: PAGES_DIR
    className?: string;       // optional override, default derived from pageKey
};

function pageKeyToFolderPath(pageKey: string): string {
    return pageKey.split(".").join("/");
}

function topLevelGroup(pageKey: string): string {
    return pageKey.split(".")[0] || "common";
}

function lastSegment(pageKey: string): string {
    return pageKey.split(".").slice(-1)[0] || "page";
}

function deriveClassName(pageKey: string): string {
    return `${toPascal(lastSegment(pageKey))}Page`;
}

function deriveMemberName(pageKey: string): string {
    return toCamelFromText(lastSegment(pageKey));
}

function buildExpectedIndexExport(pageKey: string, className: string): string {
    return `export * from "./${pageKeyToFolderPath(pageKey)}/${className}";`;
}

function buildExpectedPageManagerImport(pageKey: string, className: string): string {
    return `import { ${className} } from "./${pageKeyToFolderPath(pageKey)}/${className}";`;
}

function buildExpectedPageManagerEntry(pageKey: string, className: string): string {
    const group = topLevelGroup(pageKey);
    const member = deriveMemberName(pageKey);

    return `${member}: this.get("${group}.${member}", () => new ${className}(this.page)),`;
}

function normalizeText(text: string): string {
    return text.replace(/\r\n/g, "\n");
}

function normalizeLine(line: string): string {
    return line.trim().replace(/\s+/g, " ");
}

function hasExactLine(text: string, expectedLine: string): boolean {
    const wanted = normalizeLine(expectedLine);

    return normalizeText(text)
        .split("\n")
        .map(normalizeLine)
        .includes(wanted);
}

function extractGroupBlock(text: string, group: string): string | null {
    const normalized = normalizeText(text);
    const getterStart = normalized.indexOf(`get ${group}()`);

    if (getterStart < 0) return null;

    const returnStart = normalized.indexOf("return {", getterStart);
    if (returnStart < 0) return null;

    const blockEnd = normalized.indexOf("};", returnStart);
    if (blockEnd < 0) return null;

    return normalized.slice(returnStart, blockEnd + 2);
}

/**
 * Validates that src/pages/index.ts and src/pages/pageManager.ts contain
 * the expected export/import/entry for a single generated page.
 */
export function checkPageRegistry(args: CheckPageRegistryArgs): RegistryValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const pagesDir = args.pagesDir ?? PAGES_DIR;
    const pageKey = args.pageKey;
    const className = args.className ?? deriveClassName(pageKey);

    const indexFile = path.join(pagesDir, "index.ts");
    const pageManagerFile = path.join(pagesDir, "pageManager.ts");

    const expectedIndexExport = buildExpectedIndexExport(pageKey, className);
    const expectedPageManagerImport = buildExpectedPageManagerImport(pageKey, className);
    const expectedPageManagerEntry = buildExpectedPageManagerEntry(pageKey, className);

    const indexText = safeReadText(indexFile);
    if (!indexText) {
        warnings.push(
            `page registry: missing ${path.relative(process.cwd(), indexFile)} (skipping export check for ${pageKey}).`
        );
    } else if (!hasExactLine(indexText, expectedIndexExport)) {
        errors.push(
            `page registry: missing export in ${path.relative(
                process.cwd(),
                indexFile
            )} for ${pageKey}. Expected line: ${expectedIndexExport}`
        );
    }

    const pageManagerText = safeReadText(pageManagerFile);
    if (!pageManagerText) {
        warnings.push(
            `page registry: missing ${path.relative(process.cwd(), pageManagerFile)} (skipping PageManager checks for ${pageKey}).`
        );
        return { errors, warnings };
    }

    if (!hasExactLine(pageManagerText, expectedPageManagerImport)) {
        errors.push(
            `page registry: missing import in ${path.relative(
                process.cwd(),
                pageManagerFile
            )} for ${pageKey}. Expected line: ${expectedPageManagerImport}`
        );
    }

    const group = topLevelGroup(pageKey);
    const groupBlock = extractGroupBlock(pageManagerText, group);

    if (!groupBlock) {
        errors.push(
            `page registry: missing PageManager group "get ${group}()" in ${path.relative(
                process.cwd(),
                pageManagerFile
            )} for ${pageKey}.`
        );
        return { errors, warnings };
    }

    if (!hasExactLine(groupBlock, expectedPageManagerEntry)) {
        errors.push(
            `page registry: missing PageManager entry in group "${group}" for ${pageKey}. Expected line: ${expectedPageManagerEntry}`
        );
    }

    return { errors, warnings };
}