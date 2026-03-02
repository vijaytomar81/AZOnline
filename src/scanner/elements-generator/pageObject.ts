// src/scanner/elements-generator/pageObject.ts

import fs from "node:fs";
import type { PageMap } from "./types";

type AliasPair = { aliasKey: string; elementKey: string };

function stripLineComments(ts: string) {
    return ts.replace(/\/\/.*$/gm, "");
}

/**
 * Extract the object body from:
 *   export const aliases = { ... } as const satisfies ...
 * OR
 *   export const aliases = { ... } as Record<...>
 */
function extractAliasesObjectBody(aliasesTs: string): string | null {
    const cleaned = stripLineComments(aliasesTs);

    // Match "export const aliases = { ... }" and capture the { ... } body
    // We intentionally stop at the first closing "}" that matches this object
    // because generator output is flat and stable.
    const m = cleaned.match(/export\s+const\s+aliases\s*=\s*\{([\s\S]*?)\}\s*(?:as\s+const\s+satisfies|as\s+Record)/m);
    if (!m) return null;
    return m[1] ?? null;
}

/**
 * Extract alias pairs from aliases.ts.
 * Supported formats:
 *   saveCarDetails: aliasesGenerated.allDone,
 *   goBack: aliasesGenerated.back,
 */
function extractAliasPairsFromAliasesTs(aliasesTs: string): AliasPair[] {
    const body = extractAliasesObjectBody(aliasesTs);
    if (!body) return [];

    const re =
        /^\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*:\s*aliasesGenerated\.([A-Za-z_$][A-Za-z0-9_$]*)\s*,\s*$/gm;

    const pairs: AliasPair[] = [];
    let mm: RegExpExecArray | null;
    while ((mm = re.exec(body))) {
        pairs.push({ aliasKey: mm[1]!, elementKey: mm[2]! });
    }
    return pairs;
}

/**
 * Public: used by validators to know which alias keys exist in aliases.ts (LHS keys).
 */
export function extractAliasKeysFromAliasesTs(aliasesTs: string): Set<string> {
    const pairs = extractAliasPairsFromAliasesTs(aliasesTs);
    return new Set(pairs.map((p) => p.aliasKey));
}

function methodLinesFor(aliasKey: string, elementType: string): string[] {
    switch ((elementType || "").toLowerCase()) {
        case "input":
            return [
                `  async ${aliasKey}(value: string) {`,
                `    await this.fillAlias("${aliasKey}", value);`,
                `  }`,
            ];

        case "select":
            return [
                `  async ${aliasKey}(value: string) {`,
                `    await this.selectOptionAlias("${aliasKey}", value);`,
                `  }`,
            ];

        case "checkbox":
            return [
                `  async ${aliasKey}(checked: boolean = true) {`,
                `    await this.setCheckedAlias("${aliasKey}", checked);`,
                `  }`,
            ];

        // button/link/radio/etc -> click
        default:
            return [
                `  async ${aliasKey}() {`,
                `    await this.clickAlias("${aliasKey}");`,
                `  }`,
            ];
    }
}

function buildAliasesRegion(pageMap: PageMap, aliasesTs: string): string {
    const pairs = extractAliasPairsFromAliasesTs(aliasesTs);

    // Stable output order (helps diffs)
    pairs.sort((a, b) => a.aliasKey.localeCompare(b.aliasKey));

    const lines: string[] = [];
    lines.push(`  // <scanner:aliases>`);
    lines.push(`  // This region is auto-managed. Do not edit by hand.`);
    lines.push(``);

    for (const { aliasKey, elementKey } of pairs) {
        const def = pageMap.elements[elementKey];
        const elementType = def?.type ?? "button";
        lines.push(...methodLinesFor(aliasKey, elementType));
        lines.push(``);
    }

    lines.push(`  // </scanner:aliases>`);
    return lines.join("\n");
}

/**
 * Updates the alias region inside the page object.
 * - Requires the page file to already contain the region markers.
 * - If markers are missing, it does nothing (safe).
 */
export function syncAliasesIntoPageObject(args: {
    pageTsPath: string;
    pageMap: PageMap;
    aliasesTsPath: string;
}) {
    const { pageTsPath, pageMap, aliasesTsPath } = args;

    if (!fs.existsSync(pageTsPath)) return;
    if (!fs.existsSync(aliasesTsPath)) return;

    const pageTs = fs.readFileSync(pageTsPath, "utf8");
    const aliasesTs = fs.readFileSync(aliasesTsPath, "utf8");

    const startToken = `// <scanner:aliases>`;
    const endToken = `// </scanner:aliases>`;

    const start = pageTs.indexOf(startToken);
    const end = pageTs.indexOf(endToken);

    if (start < 0 || end < 0 || end < start) return;

    const before = pageTs.slice(0, start);
    const after = pageTs.slice(end + endToken.length);

    const region = buildAliasesRegion(pageMap, aliasesTs);

    const updated = before + region + after;
    fs.writeFileSync(pageTsPath, updated, "utf8");
}