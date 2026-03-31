// src/pageObjectTools/page-object-repair/repair/shared/pageObject.ts

import fs from "node:fs";

import { toRepoRelative } from "@utils/paths";
import { toPascal } from "@utils/ts";
import type { AliasPair } from "./aliases";
import type { ElementInfo } from "./elements";

function methodLines(aliasKey: string, type: string): string[] {
    if (type === "input") {
        return [
            `  async ${aliasKey}(value: string) {`,
            `    await this.fillAlias("${aliasKey}", value);`,
            `  }`,
        ];
    }

    if (type === "select") {
        return [
            `  async ${aliasKey}(value: string) {`,
            `    await this.selectOptionAlias("${aliasKey}", value);`,
            `  }`,
        ];
    }

    if (type === "checkbox") {
        return [
            `  async ${aliasKey}(checked: boolean = true) {`,
            `    await this.setCheckedAlias("${aliasKey}", checked);`,
            `  }`,
        ];
    }

    return [
        `  async ${aliasKey}() {`,
        `    await this.clickAlias("${aliasKey}");`,
        `  }`,
    ];
}

function classNameFromPageKey(pageKey: string): string {
    return `${toPascal(pageKey.split(".").slice(-1)[0] || "page")}Page`;
}

export function writeManagedRegion(params: {
    pageObjectPath: string;
    pageKey: string;
    aliasPairs: AliasPair[];
    elements: ElementInfo[];
}): void {
    const { pageObjectPath, pageKey, aliasPairs, elements } = params;
    const elementTypeByKey = new Map(elements.map((e) => [e.key, e.type]));
    const startToken = `// <scanner:aliases>`;
    const endToken = `// </scanner:aliases>`;

    const regionLines: string[] = [startToken, `  // This region is auto-managed. Do not edit by hand.`, ``];

    for (const pair of aliasPairs.sort((a, b) => a.aliasKey.localeCompare(b.aliasKey))) {
        regionLines.push(...methodLines(pair.aliasKey, elementTypeByKey.get(pair.generatedKey) ?? "button"));
        regionLines.push(``);
    }

    regionLines.push(endToken);

    const region = regionLines.join("\n");

    if (!fs.existsSync(pageObjectPath)) {
        const className = classNameFromPageKey(pageKey);
        const lines = [
            `// ${toRepoRelative(pageObjectPath)}`,
            `import type { Page } from "@playwright/test";`,
            `import { basePage } from "@/core/basePage";`,
            `import { elements } from "./elements";`,
            `import { aliases } from "./aliases";`,
            `import type { AliasKey } from "./aliases";`,
            ``,
            `export class ${className} extends basePage {`,
            `  constructor(page: Page) {`,
            `    super(page, ${JSON.stringify(pageKey)});`,
            `  }`,
            ``,
            `  protected async clickAlias(aliasKey: AliasKey) { await this.clickByAlias(aliases, elements, aliasKey); }`,
            `  protected async fillAlias(aliasKey: AliasKey, value: string) { await this.fillByAlias(aliases, elements, aliasKey, value); }`,
            `  protected async selectOptionAlias(aliasKey: AliasKey, value: string) { await this.selectOptionByAlias(aliases, elements, aliasKey, value); }`,
            `  protected async setCheckedAlias(aliasKey: AliasKey, checked: boolean = true) {`,
            `    const { locator } = await this.resolveByAlias(aliases, elements, aliasKey);`,
            `    await locator.setChecked(checked);`,
            `  }`,
            ``,
            region,
            ``,
            `}`,
            ``,
        ];
        fs.writeFileSync(pageObjectPath, lines.join("\n"), "utf8");
        return;
    }

    const pageTs = fs.readFileSync(pageObjectPath, "utf8");
    const start = pageTs.indexOf(startToken);
    const end = pageTs.indexOf(endToken);

    if (start < 0 || end < 0 || end < start) {
        fs.writeFileSync(pageObjectPath, `${pageTs.trimEnd()}\n\n${region}\n`, "utf8");
        return;
    }

    const lineStart = pageTs.lastIndexOf("\n", start);
    const lineStartIdx = lineStart < 0 ? 0 : lineStart + 1;
    const indent = pageTs.slice(lineStartIdx, start).match(/^\s*/)?.[0] ?? "";

    const indentedRegion = region
        .split("\n")
        .map((line) => (line.length ? indent + line.replace(/^\s+/, "") : line))
        .join("\n");

    const updated =
        pageTs.slice(0, lineStartIdx) +
        indentedRegion +
        pageTs.slice(end + endToken.length);

    fs.writeFileSync(pageObjectPath, updated, "utf8");
}