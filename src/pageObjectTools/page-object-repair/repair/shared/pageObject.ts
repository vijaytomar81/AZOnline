// src/pageObjectTools/page-object-repair/repair/shared/pageObject.ts

import fs from "node:fs";

import { toRepoRelative } from "@utils/paths";
import { toPascal } from "@utils/ts";
import type { AliasPair } from "./aliases";
import type { ElementInfo } from "./elements";

function methodLines(aliasKey: string, type: string): string[] {
    const keyRef = `aliasKeys.${aliasKey}`;

    if (type === "input") {
        return [
            `  async ${aliasKey}(value: string) {`,
            `    await this.fillAliasKey(${keyRef}, value);`,
            `  }`,
        ];
    }

    if (type === "select") {
        return [
            `  async ${aliasKey}(value: string) {`,
            `    await this.selectAliasKey(${keyRef}, value);`,
            `  }`,
        ];
    }

    if (type === "checkbox") {
        return [
            `  async ${aliasKey}(checked: boolean = true) {`,
            `    await this.setCheckedAliasKey(${keyRef}, checked);`,
            `  }`,
        ];
    }

    return [
        `  async ${aliasKey}() {`,
        `    await this.clickAliasKey(${keyRef});`,
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

    const regionLines: string[] = [
        startToken,
        `  // This region is auto-managed. Do not edit by hand.`,
        ``,
    ];

    for (const pair of aliasPairs.sort((a, b) => a.aliasKey.localeCompare(b.aliasKey))) {
        regionLines.push(
            ...methodLines(pair.aliasKey, elementTypeByKey.get(pair.generatedKey) ?? "button")
        );
        regionLines.push(``);
    }

    regionLines.push(endToken);

    const region = regionLines.join("\n");

    if (!fs.existsSync(pageObjectPath)) {
        const className = classNameFromPageKey(pageKey);
        const lines = [
            `// ${toRepoRelative(pageObjectPath)}`,
            `// pageKey: ${pageKey}`,
            ``,
            `import type { Locator, Page } from "@playwright/test";`,
            `import { expect } from "@playwright/test";`,
            `import { BasePage } from "@automation/base";`,
            `import { elements } from "./elements";`,
            `import { aliases, aliasKeys } from "./aliases";`,
            `import { pageMeta } from "./aliases.generated";`,
            ``,
            `const PAGE_KEY = ${JSON.stringify(pageKey)} as const;`,
            ``,
            `export class ${className} extends BasePage {`,
            `  constructor(page: Page) {`,
            `    super(page, PAGE_KEY);`,
            `  }`,
            ``,
            `  async waitUntilReady() {`,
            `    const readinessLocators: Locator[] = [];`,
            ``,
            `    await this.waitForStandardReady({`,
            `      expectedUrlPart: pageMeta.urlPath || undefined,`,
            `      readinessLocators,`,
            `      dismissOverlays: true,`,
            `      waitForNetworkIdle: false,`,
            `    });`,
            ``,
            `    if ((pageMeta as any).titleRe) {`,
            `      await expect(this.page).toHaveTitle((pageMeta as any).titleRe);`,
            `    } else if ((pageMeta as any).title) {`,
            `      await expect(this.page).toHaveTitle((pageMeta as any).title);`,
            `    }`,
            `  }`,
            ``,
            `  async assertOnPage() {`,
            `    if (pageMeta.urlRe) {`,
            `      await expect(this.page).toHaveURL(pageMeta.urlRe);`,
            `    } else if (pageMeta.urlPath) {`,
            `      await expect(this.page).toHaveURL(new RegExp(pageMeta.urlPath));`,
            `    }`,
            ``,
            `    if ((pageMeta as any).titleRe) {`,
            `      await expect(this.page).toHaveTitle((pageMeta as any).titleRe);`,
            `    } else if ((pageMeta as any).title) {`,
            `      await expect(this.page).toHaveTitle((pageMeta as any).title);`,
            `    }`,
            `  }`,
            ``,
            `  protected async clickAliasKey(aliasKey: keyof typeof aliases) {`,
            `    await this.actions.clickByAlias(aliases, elements, aliasKey);`,
            `  }`,
            ``,
            `  protected async fillAliasKey(aliasKey: keyof typeof aliases, value: string) {`,
            `    await this.actions.fillByAlias(aliases, elements, aliasKey, value);`,
            `  }`,
            ``,
            `  protected async selectAliasKey(aliasKey: keyof typeof aliases, value: string) {`,
            `    await this.actions.selectOptionByAlias(aliases, elements, aliasKey, value);`,
            `  }`,
            ``,
            `  protected async setCheckedAliasKey(aliasKey: keyof typeof aliases, checked: boolean = true) {`,
            `    const { locator } = await this.resolveAliasLocator(aliases, elements, aliasKey);`,
            `    await locator.setChecked(checked);`,
            `  }`,
            ``,
            region,
            ``,
            `  // You can add custom business logic methods below (safe zone).`,
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