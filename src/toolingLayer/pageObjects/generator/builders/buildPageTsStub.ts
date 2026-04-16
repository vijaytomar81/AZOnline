// src/toolingLayer/pageObjects/generator/builders/buildPageTsStub.ts

import { toPascal } from "@utils/ts";
import type { PageMap } from "../generator/types";
import {
    getPageObjectFileParts,
    headerFilePath,
} from "../utils/buildGeneratedHeader";

function buildReadinessLocatorLines(pageMap: PageMap): string[] {
    const aliases = pageMap.readiness?.recommendedAliases ?? [];

    if (aliases.length === 0) {
        return [`    const readinessLocators: Locator[] = [];`];
    }

    const lines: string[] = [`    const readinessLocators: Locator[] = await Promise.all([`];

    for (const alias of aliases) {
        lines.push(
            `      this.resolveAliasLocator(aliases, elements, aliasKeys.${alias}).then((result) => result.locator),`
        );
    }

    lines.push(`    ]);`);
    return lines;
}

export function buildPageTsStub(pageMap: PageMap): string {
    const pageKey = pageMap.pageKey;
    const lastSeg = pageKey.split(".").slice(-1)[0] || "page";
    const className = `${toPascal(lastSeg)}Page`;

    const lines: string[] = [
        headerFilePath(getPageObjectFileParts(pageKey, `${className}.ts`)),
        `// pageKey: ${pageKey}`,
        ``,
        `import type { Locator, Page } from "@playwright/test";`,
        `import { expect } from "@playwright/test";`,
        `import { BasePage } from "@frameworkCore/automation/base";`,
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
        ...buildReadinessLocatorLines(pageMap),
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
        `  // <scanner:aliases>`,
        `  // This region is auto-managed. Do not edit by hand.`,
        `  // </scanner:aliases>`,
        ``,
        `  // You can add custom business logic methods below (safe zone).`,
        `}`,
        ``,
    ];

    return lines.join("\n");
}
