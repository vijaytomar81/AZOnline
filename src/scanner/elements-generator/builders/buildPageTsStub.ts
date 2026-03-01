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
    lines.push(`import type { ElementKey } from "./elements";`);
    lines.push(`import { allAliases } from "./aliases";`);
    lines.push(`import type { AliasKey } from "./aliases";`);
    lines.push(`import { pageMeta } from "./aliases.generated";`);
    lines.push(``);
    lines.push(`const PAGE_KEY = ${JSON.stringify(pageKey)} as const;`);
    lines.push(``);
    lines.push(`export class ${className} extends BasePage {`);
    lines.push(`  constructor(page: Page) {`);
    lines.push(`    super(page);`);
    lines.push(`  }`);
    lines.push(``);
    lines.push(`  /**`);
    lines.push(`   * Optional: wait for page by URL (regex derived from page-map urlPath).`);
    lines.push(`   * If urlRe is missing, this is a no-op.`);
    lines.push(`   */`);
    lines.push(`  async waitForLoaded() {`);
    lines.push(`    if (pageMeta?.urlRe) {`);
    lines.push(`      await this.page.waitForURL(pageMeta.urlRe, {`);
    lines.push(`        timeout: Number(process.env.ACTION_TIMEOUT ?? 20_000),`);
    lines.push(`      });`);
    lines.push(`    }`);
    lines.push(`  }`);
    lines.push(``);
    lines.push(`  // --- element-key helpers (self-heal capable) ---`);
    lines.push(`  async click<K extends ElementKey>(key: K) {`);
    lines.push(`    await this.clickByKey(PAGE_KEY, String(key), elements[key]);`);
    lines.push(`  }`);
    lines.push(``);
    lines.push(`  async fill<K extends ElementKey>(key: K, value: string) {`);
    lines.push(`    await this.fillByKey(PAGE_KEY, String(key), elements[key], value);`);
    lines.push(`  }`);
    lines.push(``);
    lines.push(`  async selectOption<K extends ElementKey>(key: K, value: string) {`);
    lines.push(`    await this.selectOptionByKey(PAGE_KEY, String(key), elements[key], value);`);
    lines.push(`  }`);
    lines.push(``);
    lines.push(`  // --- alias helpers (business-friendly names) ---`);
    lines.push(`  async clickA<K extends AliasKey>(alias: K) {`);
    lines.push(`    const key = allAliases[alias];`);
    lines.push(`    await this.clickByKey(PAGE_KEY, String(key), elements[key]);`);
    lines.push(`  }`);
    lines.push(``);
    lines.push(`  async fillA<K extends AliasKey>(alias: K, value: string) {`);
    lines.push(`    const key = allAliases[alias];`);
    lines.push(`    await this.fillByKey(PAGE_KEY, String(key), elements[key], value);`);
    lines.push(`  }`);
    lines.push(``);
    lines.push(`  async selectOptionA<K extends AliasKey>(alias: K, value: string) {`);
    lines.push(`    const key = allAliases[alias];`);
    lines.push(`    await this.selectOptionByKey(PAGE_KEY, String(key), elements[key], value);`);
    lines.push(`  }`);
    lines.push(`}`);
    lines.push(``);

    return lines.join("\n");
}