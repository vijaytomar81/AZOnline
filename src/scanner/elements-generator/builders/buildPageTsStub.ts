// src/scanner/elements-generator/builders/buildPageTsStub.ts

import type { PageMap } from "../types";
import { toPascal } from "../paths";

export function buildPageTsStub(pageMap: PageMap): string {
    const pageKey = pageMap.pageKey;
    const lastSeg = pageKey.split(".").slice(-1)[0] || "page";
    const className = `${toPascal(lastSeg)}Page`;

    const lines: string[] = [];
    lines.push(`// AUTO-SCAFFOLDED (create-only) by src/scanner/elements-generator`);
    lines.push(`// pageKey: ${pageKey}`);
    lines.push(``);
    lines.push(`import type { Page } from "@playwright/test";`);
    lines.push(`import { BasePage } from "../../core/BasePage"; // adjust if needed`);
    lines.push(`import { elements } from "./elements";`);
    lines.push(`import { aliases } from "./aliases";`);
    lines.push(`import type { AliasKey } from "./aliases";`);
    lines.push(``);
    lines.push(`const PAGE_KEY = ${JSON.stringify(pageKey)} as const;`);
    lines.push(``);
    lines.push(`export class ${className} extends BasePage {`);
    lines.push(`  constructor(page: Page) {`);
    lines.push(`    super(page);`);
    lines.push(`  }`);
    lines.push(``);
    lines.push(`  // --------------------------------------------------`);
    lines.push(`  // Alias wrappers (so generated methods stay simple)`);
    lines.push(`  // --------------------------------------------------`);
    lines.push(``);
    lines.push(`  protected async clickAlias(aliasKey: AliasKey) {`);
    lines.push(`    await this.clickByAlias(PAGE_KEY, aliases, elements, aliasKey);`);
    lines.push(`  }`);
    lines.push(``);
    lines.push(`  protected async fillAlias(aliasKey: AliasKey, value: string) {`);
    lines.push(`    await this.fillByAlias(PAGE_KEY, aliases, elements, aliasKey, value);`);
    lines.push(`  }`);
    lines.push(``);
    lines.push(`  protected async selectOptionAlias(aliasKey: AliasKey, value: string) {`);
    lines.push(`    await this.selectOptionByAlias(PAGE_KEY, aliases, elements, aliasKey, value);`);
    lines.push(`  }`);
    lines.push(``);
    lines.push(`  protected async setCheckedAlias(aliasKey: AliasKey, checked: boolean = true) {`);
    lines.push(`    const { locator } = await this.resolveByAlias(PAGE_KEY, aliases, elements, aliasKey);`);
    lines.push(`    await locator.setChecked(checked, { timeout: Number(process.env.ACTION_TIMEOUT ?? 10_000) });`);
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