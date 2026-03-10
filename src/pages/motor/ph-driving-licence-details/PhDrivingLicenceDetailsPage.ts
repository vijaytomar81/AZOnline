// src/pages/motor/ph-driving-licence-details/PhDrivingLicenceDetailsPage.ts
// AUTO-SCAFFOLDED (create-only) by src/tools/page-elements-generator/builders/buildPageTsStub.ts
// pageKey: motor.ph-driving-licence-details

import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { basePage } from "../../../core/basePage"; // adjust if needed
import { elements } from "./elements";
import { aliases } from "./aliases";
import { pageMeta } from "./aliases.generated";
import type { AliasKey } from "./aliases";

const PAGE_KEY = "motor.ph-driving-licence-details" as const;

export class PhDrivingLicenceDetailsPage extends basePage {
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

  async addFrontOfLicence() {
  await this.clickAlias("addFrontOfLicence");
  }

  async addFrontOfLicence2() {
  await this.clickAlias("addFrontOfLicence2");
  }

  async address(value: string) {
  await this.selectOptionAlias("address", value);
  }

  async addresslookupwidgetAddresslookupquestioninputBuilding(value: string) {
  await this.fillAlias("addresslookupwidgetAddresslookupquestioninputBuilding", value);
  }

  async addresslookupwidgetAddresslookupquestioninputPostcode(value: string) {
  await this.fillAlias("addresslookupwidgetAddresslookupquestioninputPostcode", value);
  }

  async back() {
  await this.clickAlias("back");
  }

  async changeAddress() {
  await this.clickAlias("changeAddress");
  }

  async day(value: string) {
  await this.fillAlias("day", value);
  }

  async euFull() {
  await this.clickAlias("euFull");
  }

  async euProvisional() {
  await this.clickAlias("euProvisional");
  }

  async findAddress() {
  await this.clickAlias("findAddress");
  }

  async firstName(value: string) {
  await this.fillAlias("firstName", value);
  }

  async howLongHaveYouHeldYourLicenceFor(value: string) {
  await this.selectOptionAlias("howLongHaveYouHeldYourLicenceFor", value);
  }

  async lastName(value: string) {
  await this.fillAlias("lastName", value);
  }

  async linkToAllianzHomePage() {
  await this.clickAlias("linkToAllianzHomePage");
  }

  async month(value: string) {
  await this.fillAlias("month", value);
  }

  async month2(value: string) {
  await this.fillAlias("month2", value);
  }

  async month3(value: string) {
  await this.fillAlias("month3", value);
  }

  async month4(value: string) {
  await this.fillAlias("month4", value);
  }

  async next() {
  await this.clickAlias("next");
  }

  async no() {
  await this.clickAlias("no");
  }

  async no2() {
  await this.clickAlias("no2");
  }

  async no3() {
  await this.clickAlias("no3");
  }

  async no4() {
  await this.clickAlias("no4");
  }

  async no5() {
  await this.clickAlias("no5");
  }

  async other() {
  await this.clickAlias("other");
  }

  async partialdrivinglicencenumberquestionmonthpart(value: string) {
  await this.fillAlias("partialdrivinglicencenumberquestionmonthpart", value);
  }

  async partialdrivinglicencenumberquestionrandompart(value: string) {
  await this.fillAlias("partialdrivinglicencenumberquestionrandompart", value);
  }

  async reactSelect2Input(value: string) {
  await this.fillAlias("reactSelect2Input", value);
  }

  async reactSelect3Input(value: string) {
  await this.fillAlias("reactSelect3Input", value);
  }

  async reactSelect4Input(value: string) {
  await this.fillAlias("reactSelect4Input", value);
  }

  async removeConviction() {
  await this.clickAlias("removeConviction");
  }

  async removeConviction2() {
  await this.clickAlias("removeConviction2");
  }

  async removeConviction3() {
  await this.clickAlias("removeConviction3");
  }

  async title(value: string) {
  await this.selectOptionAlias("title", value);
  }

  async ukFull() {
  await this.clickAlias("ukFull");
  }

  async ukFullAutomaticOnly() {
  await this.clickAlias("ukFullAutomaticOnly");
  }

  async ukProvisional() {
  await this.clickAlias("ukProvisional");
  }

  async year(value: string) {
  await this.fillAlias("year", value);
  }

  async year2(value: string) {
  await this.fillAlias("year2", value);
  }

  async year3(value: string) {
  await this.fillAlias("year3", value);
  }

  async year4(value: string) {
  await this.fillAlias("year4", value);
  }

  async yes() {
  await this.clickAlias("yes");
  }

  async yes2() {
  await this.clickAlias("yes2");
  }

  async yes3() {
  await this.clickAlias("yes3");
  }

  async yes4() {
  await this.clickAlias("yes4");
  }

  async yes5() {
  await this.clickAlias("yes5");
  }

  // </scanner:aliases>

  // You can add custom business logic methods below (safe zone).
}
