// src/pageObjects/objects/athena/motor/ph-driving-licence-details/PhDrivingLicenceDetailsPage.ts
// pageKey: athena.motor.ph-driving-licence-details

import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { BasePage } from "@automation/base";
import { elements } from "./elements";
import { aliases } from "./aliases";
import { pageMeta } from "./aliases.generated";

const PAGE_KEY = "athena.motor.ph-driving-licence-details" as const;

export class PhDrivingLicenceDetailsPage extends BasePage {
  constructor(page: Page) {
    super(page, PAGE_KEY);
  }

  async waitUntilReady() {
    const readinessLocators: Locator[] = [];

    await this.waitForStandardReady({
      expectedUrlPart: pageMeta.urlPath || undefined,
      readinessLocators,
      dismissOverlays: true,
      waitForNetworkIdle: false,
    });

    if ((pageMeta as any).titleRe) {
      await expect(this.page).toHaveTitle((pageMeta as any).titleRe);
    } else if ((pageMeta as any).title) {
      await expect(this.page).toHaveTitle((pageMeta as any).title);
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

  protected async setCheckedAlias(aliasKey: keyof typeof aliases, checked: boolean = true) {
    const { locator } = await this.resolveAliasLocator(aliases, elements, aliasKey);
    await locator.setChecked(checked);
  }

  // <scanner:aliases>
  // This region is auto-managed. Do not edit by hand.

  async buttonAddAnotherConviction() {
  await this.actions.clickByAlias(aliases, elements, "buttonAddAnotherConviction");
  }

  async buttonFindAddress() {
  await this.actions.clickByAlias(aliases, elements, "buttonFindAddress");
  }

  async buttonNavigatorBack() {
  await this.actions.clickByAlias(aliases, elements, "buttonNavigatorBack");
  }

  async buttonNavigatorNext() {
  await this.actions.clickByAlias(aliases, elements, "buttonNavigatorNext");
  }

  async groupRadioConviction0ResultedToABan() {
  await this.actions.clickByAlias(aliases, elements, "groupRadioConviction0ResultedToABan");
  }

  async groupRadioConviction1ResultedToABan() {
  await this.actions.clickByAlias(aliases, elements, "groupRadioConviction1ResultedToABan");
  }

  async groupRadioConviction2ResultedToABan() {
  await this.actions.clickByAlias(aliases, elements, "groupRadioConviction2ResultedToABan");
  }

  async groupRadioDrivingLicenceHandy() {
  await this.actions.clickByAlias(aliases, elements, "groupRadioDrivingLicenceHandy");
  }

  async groupRadioDrivingLicenceTypes() {
  await this.actions.clickByAlias(aliases, elements, "groupRadioDrivingLicenceTypes");
  }

  async groupRadioHasConvictionsQuestion() {
  await this.actions.clickByAlias(aliases, elements, "groupRadioHasConvictionsQuestion");
  }

  async inputAddressLookupWidgetAddressLookupQuestionInputBuilding(value: string) {
  await this.actions.fillByAlias(aliases, elements, "inputAddressLookupWidgetAddressLookupQuestionInputBuilding", value);
  }

  async inputAddressLookupWidgetAddressLookupQuestionInputPostcode(value: string) {
  await this.actions.fillByAlias(aliases, elements, "inputAddressLookupWidgetAddressLookupQuestionInputPostcode", value);
  }

  async inputConviction1DateMonth(value: string) {
  await this.actions.fillByAlias(aliases, elements, "inputConviction1DateMonth", value);
  }

  async inputConviction1DateYear(value: string) {
  await this.actions.fillByAlias(aliases, elements, "inputConviction1DateYear", value);
  }

  async inputConviction2DateMonth(value: string) {
  await this.actions.fillByAlias(aliases, elements, "inputConviction2DateMonth", value);
  }

  async inputConviction2DateYear(value: string) {
  await this.actions.fillByAlias(aliases, elements, "inputConviction2DateYear", value);
  }

  async inputConviction3DateMonth(value: string) {
  await this.actions.fillByAlias(aliases, elements, "inputConviction3DateMonth", value);
  }

  async inputConviction3DateYear(value: string) {
  await this.actions.fillByAlias(aliases, elements, "inputConviction3DateYear", value);
  }

  async inputDateOfBirthDay(value: string) {
  await this.actions.fillByAlias(aliases, elements, "inputDateOfBirthDay", value);
  }

  async inputDateOfBirthMonth(value: string) {
  await this.actions.fillByAlias(aliases, elements, "inputDateOfBirthMonth", value);
  }

  async inputDateOfBirthYear(value: string) {
  await this.actions.fillByAlias(aliases, elements, "inputDateOfBirthYear", value);
  }

  async inputFirstName(value: string) {
  await this.actions.fillByAlias(aliases, elements, "inputFirstName", value);
  }

  async inputLastName(value: string) {
  await this.actions.fillByAlias(aliases, elements, "inputLastName", value);
  }

  async linkRemoveConviction() {
  await this.actions.clickByAlias(aliases, elements, "linkRemoveConviction");
  }

  async linkRemoveConviction2() {
  await this.actions.clickByAlias(aliases, elements, "linkRemoveConviction2");
  }

  async linkRemoveConviction3() {
  await this.actions.clickByAlias(aliases, elements, "linkRemoveConviction3");
  }

  async linkToAllianzHomePage() {
  await this.actions.clickByAlias(aliases, elements, "linkToAllianzHomePage");
  }

  async radioConviction0ResultedToABanno() {
  await this.actions.clickByAlias(aliases, elements, "radioConviction0ResultedToABanno");
  }

  async radioConviction0ResultedToABanyes() {
  await this.actions.clickByAlias(aliases, elements, "radioConviction0ResultedToABanyes");
  }

  async radioConviction1ResultedToABanno() {
  await this.actions.clickByAlias(aliases, elements, "radioConviction1ResultedToABanno");
  }

  async radioConviction1ResultedToABanyes() {
  await this.actions.clickByAlias(aliases, elements, "radioConviction1ResultedToABanyes");
  }

  async radioConviction2ResultedToABanno() {
  await this.actions.clickByAlias(aliases, elements, "radioConviction2ResultedToABanno");
  }

  async radioConviction2ResultedToABanyes() {
  await this.actions.clickByAlias(aliases, elements, "radioConviction2ResultedToABanyes");
  }

  async radioDrivingLicenceHandyno() {
  await this.actions.clickByAlias(aliases, elements, "radioDrivingLicenceHandyno");
  }

  async radioDrivingLicenceHandyyes() {
  await this.actions.clickByAlias(aliases, elements, "radioDrivingLicenceHandyyes");
  }

  async radioDrivingLicenceTypeseuFull() {
  await this.actions.clickByAlias(aliases, elements, "radioDrivingLicenceTypeseuFull");
  }

  async radioDrivingLicenceTypeseuProvisional() {
  await this.actions.clickByAlias(aliases, elements, "radioDrivingLicenceTypeseuProvisional");
  }

  async radioDrivingLicenceTypesother() {
  await this.actions.clickByAlias(aliases, elements, "radioDrivingLicenceTypesother");
  }

  async radioDrivingLicenceTypesukFull() {
  await this.actions.clickByAlias(aliases, elements, "radioDrivingLicenceTypesukFull");
  }

  async radioDrivingLicenceTypesukFullAutomaticOnly() {
  await this.actions.clickByAlias(aliases, elements, "radioDrivingLicenceTypesukFullAutomaticOnly");
  }

  async radioDrivingLicenceTypesukProvisional() {
  await this.actions.clickByAlias(aliases, elements, "radioDrivingLicenceTypesukProvisional");
  }

  async radioHasConvictionsQuestionno() {
  await this.actions.clickByAlias(aliases, elements, "radioHasConvictionsQuestionno");
  }

  async radioHasConvictionsQuestionyes() {
  await this.actions.clickByAlias(aliases, elements, "radioHasConvictionsQuestionyes");
  }

  async searchSelectTheConvictionCode(value: string) {
  await this.actions.fillByAlias(aliases, elements, "searchSelectTheConvictionCode", value);
  }

  async searchSelectTheConvictionCode2(value: string) {
  await this.actions.fillByAlias(aliases, elements, "searchSelectTheConvictionCode2", value);
  }

  async searchSelectTheConvictionCode3(value: string) {
  await this.actions.fillByAlias(aliases, elements, "searchSelectTheConvictionCode3", value);
  }

  async selectAddressLookupQuestionInput(value: string) {
  await this.actions.selectOptionByAlias(aliases, elements, "selectAddressLookupQuestionInput", value);
  }

  async selectDrivingExpirience(value: string) {
  await this.actions.selectOptionByAlias(aliases, elements, "selectDrivingExpirience", value);
  }

  async selectTitleQuestion(value: string) {
  await this.actions.selectOptionByAlias(aliases, elements, "selectTitleQuestion", value);
  }

  // </scanner:aliases>

  // You can add custom business logic methods below (safe zone).
}
