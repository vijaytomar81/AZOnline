// src/tools/page-object-generator/generator/pageObject.ts
import fs from "node:fs";

import type { PageMap } from "./types";
import {
    extractAliasKeysFromAliasesTs,
    extractAliasPairsFromAliasesTs,
} from "./aliasParser/shared";

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

export { extractAliasKeysFromAliasesTs };

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

    const lineStart = pageTs.lastIndexOf("\n", start);
    const lineStartIdx = lineStart < 0 ? 0 : lineStart + 1;
    const indent = pageTs.slice(lineStartIdx, start).match(/^\s*/)?.[0] ?? "";

    const rawRegion = buildAliasesRegion(pageMap, aliasesTs);
    const region = rawRegion
        .split("\n")
        .map((line) => (line.length ? indent + line.replace(/^\s+/, "") : line))
        .join("\n");

    const before = pageTs.slice(0, lineStartIdx);
    const after = pageTs.slice(end + endToken.length);

    const updated = before + region + after;
    fs.writeFileSync(pageTsPath, updated, "utf8");
}