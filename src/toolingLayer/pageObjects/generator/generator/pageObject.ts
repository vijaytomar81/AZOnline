// src/toolingLayer/pageObjects/generator/generator/pageObject.ts

import fs from "node:fs";

import {
    extractAliasPairsFromAliasesTs,
    extractAliasKeysFromAliasesTs,
} from "./aliasParser/shared";

type ElementTypeMap = Map<string, string>;

function parseElementTypes(elementsTs: string): ElementTypeMap {
    const body =
        elementsTs.match(/export const elements = \{([\s\S]*?)\}\s*as const;/m)?.[1] ?? "";
    const entryRe =
        /^\s*(?:"([^"]+)"|([A-Za-z_$][A-Za-z0-9_$]*)):\s*\{([\s\S]*?)^\s*\},?$/gm;

    const map = new Map<string, string>();
    let match: RegExpExecArray | null;

    while ((match = entryRe.exec(body))) {
        const key = match[1] ?? match[2];
        const block = match[3] ?? "";

        if (!key) {
            continue;
        }

        map.set(key, block.match(/type:\s*"([^"]*)"/)?.[1] ?? "button");
    }

    return map;
}

function methodLinesFor(aliasKey: string, elementType: string): string[] {
    const keyRef = `aliasKeys.${aliasKey}`;

    switch ((elementType || "").toLowerCase()) {
        case "input":
            return [
                `  async ${aliasKey}(value: string) {`,
                `    await this.fillAliasKey(${keyRef}, value);`,
                `  }`,
            ];

        case "select":
            return [
                `  async ${aliasKey}(value: string) {`,
                `    await this.selectAliasKey(${keyRef}, value);`,
                `  }`,
            ];

        case "checkbox":
            return [
                `  async ${aliasKey}(checked: boolean = true) {`,
                `    await this.setCheckedAliasKey(${keyRef}, checked);`,
                `  }`,
            ];

        default:
            return [
                `  async ${aliasKey}() {`,
                `    await this.clickAliasKey(${keyRef});`,
                `  }`,
            ];
    }
}

function buildAliasesRegion(
    aliasesTs: string,
    elementTypes: ElementTypeMap
): string {
    const pairs = extractAliasPairsFromAliasesTs(aliasesTs).sort((a, b) =>
        a.aliasKey.localeCompare(b.aliasKey)
    );

    const lines: string[] = [
        `  // <scanner:aliases>`,
        `  // This region is auto-managed. Do not edit by hand.`,
        ``,
    ];

    for (const { aliasKey, elementKey } of pairs) {
        lines.push(
            ...methodLinesFor(aliasKey, elementTypes.get(elementKey) ?? "button")
        );
        lines.push(``);
    }

    lines.push(`  // </scanner:aliases>`);
    return lines.join("\n");
}

export { extractAliasKeysFromAliasesTs };

export function syncAliasesIntoPageObject(args: {
    pageTsPath: string;
    elementsTsPath: string;
    aliasesTsPath: string;
}) {
    const { pageTsPath, elementsTsPath, aliasesTsPath } = args;

    if (
        !fs.existsSync(pageTsPath) ||
        !fs.existsSync(aliasesTsPath) ||
        !fs.existsSync(elementsTsPath)
    ) {
        return;
    }

    const pageTs = fs.readFileSync(pageTsPath, "utf8");
    const aliasesTs = fs.readFileSync(aliasesTsPath, "utf8");
    const elementTypes = parseElementTypes(
        fs.readFileSync(elementsTsPath, "utf8")
    );

    const startToken = `// <scanner:aliases>`;
    const endToken = `// </scanner:aliases>`;
    const start = pageTs.indexOf(startToken);
    const end = pageTs.indexOf(endToken);

    if (start < 0 || end < 0 || end < start) {
        return;
    }

    const lineStart = pageTs.lastIndexOf("\n", start);
    const lineStartIdx = lineStart < 0 ? 0 : lineStart + 1;
    const indent = pageTs.slice(lineStartIdx, start).match(/^\s*/)?.[0] ?? "";

    const rawRegion = buildAliasesRegion(aliasesTs, elementTypes);
    const region = rawRegion
        .split("\n")
        .map((line) => (line.length ? indent + line.replace(/^\s+/, "") : line))
        .join("\n");

    const updated =
        pageTs.slice(0, lineStartIdx) +
        region +
        pageTs.slice(end + endToken.length);

    fs.writeFileSync(pageTsPath, updated, "utf8");
}
