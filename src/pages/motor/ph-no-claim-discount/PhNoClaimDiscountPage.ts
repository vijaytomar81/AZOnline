// src/pages/motor/ph-no-claim-discount/PhNoClaimDiscountPage.ts
// AUTO-SCAFFOLDED (create-only) by src/tools/page-elements-generator/builders/buildPageTsStub.ts
// pageKey: motor.ph-no-claim-discount

import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { basePage } from "../../../core/basePage"; // adjust if needed
import { elements } from "./elements";
import { aliases } from "./aliases";
import { pageMeta } from "./aliases.generated";
import type { AliasKey } from "./aliases";

const PAGE_KEY = "motor.ph-no-claim-discount" as const;

export class PhNoClaimDiscountPage extends basePage {
  constructor(page: Page) {
    super(page, PAGE_KEY);
  }

  // --------------------------------------------------
  // Page-level helpers (URL + Title awareness)
  // --------------------------------------------------

  async waitForPage() {
    const timeout = Number(process.env.PAGE_TIMEOUT ?? 15_000);

    if (pageMeta.urlRe) {
      await this.page.waitForURL(pageMeta.urlRe, { timeout });
    } else if (pageMeta.urlPath) {
      await this.page.waitForURL(new RegExp(pageMeta.urlPath), { timeout });
    }

    if ((pageMeta as any).titleRe) {
      await expect(this.page).toHaveTitle((pageMeta as any).titleRe, { timeout });
    } else if ((pageMeta as any).title) {
      await expect(this.page).toHaveTitle((pageMeta as any).title, { timeout });
    }
  }

  async assertOnPage() {
    if (pageMeta.urlRe) {
      await expect(this.page).toHaveURL(pageMeta.urlRe);
    } else if (pageMeta.urlPath) {
      await expect(this.page).toHaveURL(new RegExp(pageMeta.urlPath));
    }

    if ((pageMeta as any).titleRe) {
      await expect(this.page).toHaveTitle((pageMeta as any).titleRe);
    } else if ((pageMeta as any).title) {
      await expect(this.page).toHaveTitle((pageMeta as any).title);
    }
  }

  // --------------------------------------------------
  // Alias wrappers (so generated methods stay simple)
  // --------------------------------------------------

  protected async clickAlias(aliasKey: AliasKey) {
    await this.clickByAlias(aliases, elements, aliasKey);
  }

  protected async fillAlias(aliasKey: AliasKey, value: string) {
    await this.fillByAlias(aliases, elements, aliasKey, value);
  }

  protected async selectOptionAlias(aliasKey: AliasKey, value: string) {
    await this.selectOptionByAlias(aliases, elements, aliasKey, value);
  }

  protected async setCheckedAlias(aliasKey: AliasKey, checked: boolean = true) {
    const { locator } = await this.resolveByAlias(aliases, elements, aliasKey);
    await locator.setChecked(checked, { timeout: Number(process.env.ACTION_TIMEOUT ?? 10_000) });
  }

  // <scanner:aliases>
  // This region is auto-managed. Do not edit by hand.

  async back() {
  await this.clickAlias("back");
  }

  async inAnotherCountry() {
  await this.clickAlias("inAnotherCountry");
  }

  async linkToAllianzHomePage() {
  await this.clickAlias("linkToAllianzHomePage");
  }

  async namedDriverOnAnotherPolicy() {
  await this.clickAlias("namedDriverOnAnotherPolicy");
  }

  async ncdyearsquestion(value: string) {
  await this.selectOptionAlias("ncdyearsquestion", value);
  }

  async next() {
  await this.clickAlias("next");
  }

  async no() {
  await this.clickAlias("no");
  }

  async withACompanyCar() {
  await this.clickAlias("withACompanyCar");
  }

  async withThisCarSh11ukaOrAPreviousCar() {
  await this.clickAlias("withThisCarSh11ukaOrAPreviousCar");
  }

  async yes() {
  await this.clickAlias("yes");
  }

  // </scanner:aliases>

  // You can add custom business logic methods below (safe zone).
}
