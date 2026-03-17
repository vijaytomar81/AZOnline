// src/pages/objects/athena/motor/ph-driving-licence-details/PhDrivingLicenceDetailsPage.ts
// AUTO-SCAFFOLDED (create-only) by src/tools/page-elements-generator/builders/buildPageTsStub.ts
// pageKey: athena.motor.ph-driving-licence-details

import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { basePage } from "@/core/basePage";
import { elements } from "./elements";
import { aliases } from "./aliases";
import { pageMeta } from "./aliases.generated";
import type { AliasKey } from "./aliases";

const PAGE_KEY = "athena.motor.ph-driving-licence-details" as const;

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

  async buttonAddAnotherConviction() {
  await this.clickAlias("buttonAddAnotherConviction");
  }

  async buttonFindAddress() {
  await this.clickAlias("buttonFindAddress");
  }

  async buttonNavigatorBack() {
  await this.clickAlias("buttonNavigatorBack");
  }

  async buttonNavigatorNext() {
  await this.clickAlias("buttonNavigatorNext");
  }

  async groupRadioConviction0ResultedToABan() {
  await this.clickAlias("groupRadioConviction0ResultedToABan");
  }

  async groupRadioConviction1ResultedToABan() {
  await this.clickAlias("groupRadioConviction1ResultedToABan");
  }

  async groupRadioConviction2ResultedToABan() {
  await this.clickAlias("groupRadioConviction2ResultedToABan");
  }

  async groupRadioDrivingLicenceHandy() {
  await this.clickAlias("groupRadioDrivingLicenceHandy");
  }

  async groupRadioDrivingLicenceTypes() {
  await this.clickAlias("groupRadioDrivingLicenceTypes");
  }

  async groupRadioHasConvictionsQuestion() {
  await this.clickAlias("groupRadioHasConvictionsQuestion");
  }

  async inputAddressLookupWidgetAddressLookupQuestionInputBuilding(value: string) {
  await this.fillAlias("inputAddressLookupWidgetAddressLookupQuestionInputBuilding", value);
  }

  async inputAddressLookupWidgetAddressLookupQuestionInputPostcode(value: string) {
  await this.fillAlias("inputAddressLookupWidgetAddressLookupQuestionInputPostcode", value);
  }

  async inputConviction1DateMonth(value: string) {
  await this.fillAlias("inputConviction1DateMonth", value);
  }

  async inputConviction1DateYear(value: string) {
  await this.fillAlias("inputConviction1DateYear", value);
  }

  async inputConviction2DateMonth(value: string) {
  await this.fillAlias("inputConviction2DateMonth", value);
  }

  async inputConviction2DateYear(value: string) {
  await this.fillAlias("inputConviction2DateYear", value);
  }

  async inputConviction3DateMonth(value: string) {
  await this.fillAlias("inputConviction3DateMonth", value);
  }

  async inputConviction3DateYear(value: string) {
  await this.fillAlias("inputConviction3DateYear", value);
  }

  async inputDateOfBirthDay(value: string) {
  await this.fillAlias("inputDateOfBirthDay", value);
  }

  async inputDateOfBirthMonth(value: string) {
  await this.fillAlias("inputDateOfBirthMonth", value);
  }

  async inputDateOfBirthYear(value: string) {
  await this.fillAlias("inputDateOfBirthYear", value);
  }

  async inputFirstName(value: string) {
  await this.fillAlias("inputFirstName", value);
  }

  async inputLastName(value: string) {
  await this.fillAlias("inputLastName", value);
  }

  async linkRemoveConviction() {
  await this.clickAlias("linkRemoveConviction");
  }

  async linkRemoveConviction2() {
  await this.clickAlias("linkRemoveConviction2");
  }

  async linkRemoveConviction3() {
  await this.clickAlias("linkRemoveConviction3");
  }

  async linkToAllianzHomePage() {
  await this.clickAlias("linkToAllianzHomePage");
  }

  async radioConviction0ResultedToABanno() {
  await this.clickAlias("radioConviction0ResultedToABanno");
  }

  async radioConviction0ResultedToABanyes() {
  await this.clickAlias("radioConviction0ResultedToABanyes");
  }

  async radioConviction1ResultedToABanno() {
  await this.clickAlias("radioConviction1ResultedToABanno");
  }

  async radioConviction1ResultedToABanyes() {
  await this.clickAlias("radioConviction1ResultedToABanyes");
  }

  async radioConviction2ResultedToABanno() {
  await this.clickAlias("radioConviction2ResultedToABanno");
  }

  async radioConviction2ResultedToABanyes() {
  await this.clickAlias("radioConviction2ResultedToABanyes");
  }

  async radioDrivingLicenceHandyno() {
  await this.clickAlias("radioDrivingLicenceHandyno");
  }

  async radioDrivingLicenceHandyyes() {
  await this.clickAlias("radioDrivingLicenceHandyyes");
  }

  async radioDrivingLicenceTypeseuFull() {
  await this.clickAlias("radioDrivingLicenceTypeseuFull");
  }

  async radioDrivingLicenceTypeseuProvisional() {
  await this.clickAlias("radioDrivingLicenceTypeseuProvisional");
  }

  async radioDrivingLicenceTypesother() {
  await this.clickAlias("radioDrivingLicenceTypesother");
  }

  async radioDrivingLicenceTypesukFull() {
  await this.clickAlias("radioDrivingLicenceTypesukFull");
  }

  async radioDrivingLicenceTypesukFullAutomaticOnly() {
  await this.clickAlias("radioDrivingLicenceTypesukFullAutomaticOnly");
  }

  async radioDrivingLicenceTypesukProvisional() {
  await this.clickAlias("radioDrivingLicenceTypesukProvisional");
  }

  async radioHasConvictionsQuestionno() {
  await this.clickAlias("radioHasConvictionsQuestionno");
  }

  async radioHasConvictionsQuestionyes() {
  await this.clickAlias("radioHasConvictionsQuestionyes");
  }

  async searchSelectTheConvictionCode(value: string) {
  await this.fillAlias("searchSelectTheConvictionCode", value);
  }

  async searchSelectTheConvictionCode2(value: string) {
  await this.fillAlias("searchSelectTheConvictionCode2", value);
  }

  async searchSelectTheConvictionCode3(value: string) {
  await this.fillAlias("searchSelectTheConvictionCode3", value);
  }

  async selectAddressLookupQuestionInput(value: string) {
  await this.selectOptionAlias("selectAddressLookupQuestionInput", value);
  }

  async selectDrivingExpirience(value: string) {
  await this.selectOptionAlias("selectDrivingExpirience", value);
  }

  async selectTitleQuestion(value: string) {
  await this.selectOptionAlias("selectTitleQuestion", value);
  }

  // </scanner:aliases>

  // You can add custom business logic methods below (safe zone).
}
