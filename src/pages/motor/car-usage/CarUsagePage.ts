// src/pages/motor/car-usage/CarUsagePage.ts
// AUTO-SCAFFOLDED (create-only) by src/tools/page-elements-generator/builders/buildPageTsStub.ts
// pageKey: motor.car-usage

import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { basePage } from "../../../core/basePage"; // adjust if needed
import { elements } from "./elements";
import { aliases } from "./aliases";
import { pageMeta } from "./aliases.generated";
import type { AliasKey } from "./aliases";

const PAGE_KEY = "motor.car-usage" as const;

export class CarUsagePage extends basePage {
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

  async addAnotherDriver() {
  await this.clickAlias("addAnotherDriver");
  }

  async back() {
  await this.clickAlias("back");
  }

  async businessUseCommercial() {
  await this.clickAlias("businessUseCommercial");
  }

  async businessUseNonCommercial() {
  await this.clickAlias("businessUseNonCommercial");
  }

  async drive() {
  await this.clickAlias("drive");
  }

  async garage() {
  await this.clickAlias("garage");
  }

  async linkToAllianzHomePage() {
  await this.clickAlias("linkToAllianzHomePage");
  }

  async maindriver(value: string) {
  await this.selectOptionAlias("maindriver", value);
  }

  async next() {
  await this.clickAlias("next");
  }

  async no() {
  await this.clickAlias("no");
  }

  async registeredkeeper(value: string) {
  await this.selectOptionAlias("registeredkeeper", value);
  }

  async registeredkeeper2(value: string) {
  await this.selectOptionAlias("registeredkeeper2", value);
  }

  async road() {
  await this.clickAlias("road");
  }

  async securedCarPark() {
  await this.clickAlias("securedCarPark");
  }

  async socialDomesticAndPleasure() {
  await this.clickAlias("socialDomesticAndPleasure");
  }

  async socialDomesticPleasureAndCommutingSdpC() {
  await this.clickAlias("socialDomesticPleasureAndCommutingSdpC");
  }

  async tomAlleneditdelete(checked: boolean = true) {
  await this.setCheckedAlias("tomAlleneditdelete", checked);
  }

  async tomAlleneditdelete2() {
  await this.clickAlias("tomAlleneditdelete2");
  }

  async tomAlleneditdelete3() {
  await this.clickAlias("tomAlleneditdelete3");
  }

  async unsecuredCarPark() {
  await this.clickAlias("unsecuredCarPark");
  }

  async vjTomaredit(checked: boolean = true) {
  await this.setCheckedAlias("vjTomaredit", checked);
  }

  async vjTomaredit2() {
  await this.clickAlias("vjTomaredit2");
  }

  async whatIsThisMiniCooperSh11ukaUsedFor() {
  await this.clickAlias("whatIsThisMiniCooperSh11ukaUsedFor");
  }

  async whatSYourEstimatedAnnualMileage(value: string) {
  await this.selectOptionAlias("whatSYourEstimatedAnnualMileage", value);
  }

  async whereIsThisCarKeptPleaseEnterPostCodeOnly(value: string) {
  await this.fillAlias("whereIsThisCarKeptPleaseEnterPostCodeOnly", value);
  }

  async yes() {
  await this.clickAlias("yes");
  }

  // </scanner:aliases>

  // You can add custom business logic methods below (safe zone).
}
