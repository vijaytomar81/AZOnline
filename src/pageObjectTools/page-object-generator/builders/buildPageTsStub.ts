// src/pageObjectTools/page-object-generator/builders/buildPageTsStub.ts

import type { PageMap } from "../generator/types";
import { toPascal } from "@utils/ts";
import {
    headerFilePath,
    getPageObjectFileParts,
} from "../utils/buildGeneratedHeader";

export function buildPageTsStub(pageMap: PageMap): string {
    const pageKey = pageMap.pageKey;
    const lastSeg = pageKey.split(".").slice(-1)[0] || "page";
    const className = `${toPascal(lastSeg)}Page`;

    const lines: string[] = [];

    lines.push(
        headerFilePath(getPageObjectFileParts(pageKey, `${className}.ts`))
    );

    lines.push(`// pageKey: ${pageKey}`);
    lines.push(``);
    lines.push(`import type { Locator, Page } from "@playwright/test";`);
    lines.push(`import { expect } from "@playwright/test";`);
    lines.push(`import { BasePage } from "@automation/base";`);
    lines.push(`import { elements } from "./elements";`);
    lines.push(`import { aliases } from "./aliases";`);
    lines.push(`import { pageMeta } from "./aliases.generated";`);
    lines.push(``);
    lines.push(`const PAGE_KEY = ${JSON.stringify(pageKey)} as const;`);
    lines.push(``);
    lines.push(`export class ${className} extends BasePage {`);
    lines.push(`  constructor(page: Page) {`);
    lines.push(`    super(page, PAGE_KEY);`);
    lines.push(`  }`);
    lines.push(``);
    lines.push(`  async waitUntilReady() {`);
    lines.push(`    const readinessLocators: Locator[] = [];`);
    lines.push(``);
    lines.push(`    await this.waitForStandardReady({`);
    lines.push(`      expectedUrlPart: pageMeta.urlPath || undefined,`);
    lines.push(`      readinessLocators,`);
    lines.push(`      dismissOverlays: true,`);
    lines.push(`      waitForNetworkIdle: false,`);
    lines.push(`    });`);
    lines.push(``);
    lines.push(`    if ((pageMeta as any).titleRe) {`);
    lines.push(`      await expect(this.page).toHaveTitle((pageMeta as any).titleRe);`);
    lines.push(`    } else if ((pageMeta as any).title) {`);
    lines.push(`      await expect(this.page).toHaveTitle((pageMeta as any).title);`);
    lines.push(`    }`);
    lines.push(`  }`);
    lines.push(``);
    lines.push(`  async assertOnPage() {`);
    lines.push(`    if (pageMeta.urlRe) {`);
    lines.push(`      await expect(this.page).toHaveURL(pageMeta.urlRe);`);
    lines.push(`    } else if (pageMeta.urlPath) {`);
    lines.push(`      await expect(this.page).toHaveURL(new RegExp(pageMeta.urlPath));`);
    lines.push(`    }`);
    lines.push(``);
    lines.push(`    if ((pageMeta as any).titleRe) {`);
    lines.push(`      await expect(this.page).toHaveTitle((pageMeta as any).titleRe);`);
    lines.push(`    } else if ((pageMeta as any).title) {`);
    lines.push(`      await expect(this.page).toHaveTitle((pageMeta as any).title);`);
    lines.push(`    }`);
    lines.push(`  }`);
    lines.push(``);
    lines.push(`  protected async setCheckedAlias(aliasKey: keyof typeof aliases, checked: boolean = true) {`);
    lines.push(`    const { locator } = await this.resolveAliasLocator(aliases, elements, aliasKey);`);
    lines.push(`    await locator.setChecked(checked);`);
    lines.push(`  }`);
    lines.push(``);
    lines.push(`  // <scanner:aliases>`);
    lines.push(`  // This region is auto-managed. Do not edit by hand.`);
    lines.push(`  // </scanner:aliases>`);
    lines.push(``);
    lines.push(`  // You can add custom business logic methods below (safe zone).`);
    lines.push(`}`);
    lines.push(``);

    return lines.join("\n");
}
