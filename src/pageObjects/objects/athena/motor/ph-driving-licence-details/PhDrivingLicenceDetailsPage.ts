// src/pageObjects/objects/athena/motor/ph-driving-licence-details/PhDrivingLicenceDetailsPage.ts
// pageKey: athena.motor.ph-driving-licence-details

import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { BasePage } from "@automation/base";
import { elements } from "./elements";
import { aliases, aliasKeys } from "./aliases";
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
  await this.actions.clickByAlias(aliases, elements, aliasKeys.buttonAddAnotherConviction);
  }

  async buttonFindAddress() {
  await this.actions.clickByAlias(aliases, elements, aliasKeys.buttonFindAddress);
  }

  async buttonNavigatorBack() {
  await this.actions.clickByAlias(aliases, elements, aliasKeys.buttonNavigatorBack);
  }

  async buttonNavigatorNext() {
  await this.actions.clickByAlias(aliases, elements, aliasKeys.buttonNavigatorNext);
  }

  async groupRadioConviction0ResultedToABan() {
  await this.actions.clickByAlias(aliases, elements, aliasKeys.groupRadioConviction0ResultedToABan);
  }

  async groupRadioConviction1ResultedToABan() {
  await this.actions.clickByAlias(aliases, elements, aliasKeys.groupRadioConviction1ResultedToABan);
  }

  async groupRadioConviction2ResultedToABan() {
  await this.actions.clickByAlias(aliases, elements, aliasKeys.groupRadioConviction2ResultedToABan);
  }

  async groupRadioDrivingLicenceHandy() {
  await this.actions.clickByAlias(aliases, elements, aliasKeys.groupRadioDrivingLicenceHandy);
  }

  async groupRadioDrivingLicenceTypes() {
  await this.actions.clickByAlias(aliases, elements, aliasKeys.groupRadioDrivingLicenceTypes);
  }

  async groupRadioHasConvictionsQuestion() {
  await this.actions.clickByAlias(aliases, elements, aliasKeys.groupRadioHasConvictionsQuestion);
  }

  async inputAddressLookupWidgetAddressLookupQuestionInputBuilding(value: string) {
  await this.actions.fillByAlias(aliases, elements, aliasKeys.inputAddressLookupWidgetAddressLookupQuestionInputBuilding, value);
  }

  async inputAddressLookupWidgetAddressLookupQuestionInputPostcode(value: string) {
  await this.actions.fillByAlias(aliases, elements, aliasKeys.inputAddressLookupWidgetAddressLookupQuestionInputPostcode, value);
  }

  async inputConviction1DateMonth(value: string) {
  await this.actions.fillByAlias(aliases, elements, aliasKeys.inputConviction1DateMonth, value);
  }

  async inputConviction1DateYear(value: string) {
  await this.actions.fillByAlias(aliases, elements, aliasKeys.inputConviction1DateYear, value);
  }

  async inputConviction2DateMonth(value: string) {
  await this.actions.fillByAlias(aliases, elements, aliasKeys.inputConviction2DateMonth, value);
  }

  async inputConviction2DateYear(value: string) {
  await this.actions.fillByAlias(aliases, elements, aliasKeys.inputConviction2DateYear, value);
  }

  async inputConviction3DateMonth(value: string) {
  await this.actions.fillByAlias(aliases, elements, aliasKeys.inputConviction3DateMonth, value);
  }

  async inputConviction3DateYear(value: string) {
  await this.actions.fillByAlias(aliases, elements, aliasKeys.inputConviction3DateYear, value);
  }

  async inputDateOfBirthDay(value: string) {
  await this.actions.fillByAlias(aliases, elements, aliasKeys.inputDateOfBirthDay, value);
  }

  async inputDateOfBirthMonth(value: string) {
  await this.actions.fillByAlias(aliases, elements, aliasKeys.inputDateOfBirthMonth, value);
  }

  async inputDateOfBirthYear(value: string) {
  await this.actions.fillByAlias(aliases, elements, aliasKeys.inputDateOfBirthYear, value);
  }

  async inputFirstName(value: string) {
  await this.actions.fillByAlias(aliases, elements, aliasKeys.inputFirstName, value);
  }

  async inputLastName(value: string) {
  await this.actions.fillByAlias(aliases, elements, aliasKeys.inputLastName, value);
  }

  async linkRemoveConviction() {
  await this.actions.clickByAlias(aliases, elements, aliasKeys.linkRemoveConviction);
  }

  async linkRemoveConviction2() {
  await this.actions.clickByAlias(aliases, elements, aliasKeys.linkRemoveConviction2);
  }

  async linkRemoveConviction3() {
  await this.actions.clickByAlias(aliases, elements, aliasKeys.linkRemoveConviction3);
  }

  async linkToAllianzHomePage() {
  await this.actions.clickByAlias(aliases, elements, aliasKeys.linkToAllianzHomePage);
  }

  async radioConviction0ResultedToABanno() {
  await this.actions.clickByAlias(aliases, elements, aliasKeys.radioConviction0ResultedToABanno);
  }

  async radioConviction0ResultedToABanyes() {
  await this.actions.clickByAlias(aliases, elements, aliasKeys.radioConviction0ResultedToABanyes);
  }

  async radioConviction1ResultedToABanno() {
  await this.actions.clickByAlias(aliases, elements, aliasKeys.radioConviction1ResultedToABanno);
  }

  async radioConviction1ResultedToABanyes() {
  await this.actions.clickByAlias(aliases, elements, aliasKeys.radioConviction1ResultedToABanyes);
  }

  async radioConviction2ResultedToABanno() {
  await this.actions.clickByAlias(aliases, elements, aliasKeys.radioConviction2ResultedToABanno);
  }

  async radioConviction2ResultedToABanyes() {
  await this.actions.clickByAlias(aliases, elements, aliasKeys.radioConviction2ResultedToABanyes);
  }

  async radioDrivingLicenceHandyno() {
  await this.actions.clickByAlias(aliases, elements, aliasKeys.radioDrivingLicenceHandyno);
  }

  async radioDrivingLicenceHandyyes() {
  await this.actions.clickByAlias(aliases, elements, aliasKeys.radioDrivingLicenceHandyyes);
  }

  async radioDrivingLicenceTypeseuFull() {
  await this.actions.clickByAlias(aliases, elements, aliasKeys.radioDrivingLicenceTypeseuFull);
  }

  async radioDrivingLicenceTypeseuProvisional() {
  await this.actions.clickByAlias(aliases, elements, aliasKeys.radioDrivingLicenceTypeseuProvisional);
  }

  async radioDrivingLicenceTypesother() {
  await this.actions.clickByAlias(aliases, elements, aliasKeys.radioDrivingLicenceTypesother);
  }

  async radioDrivingLicenceTypesukFull() {
  await this.actions.clickByAlias(aliases, elements, aliasKeys.radioDrivingLicenceTypesukFull);
  }

  async radioDrivingLicenceTypesukFullAutomaticOnly() {
  await this.actions.clickByAlias(aliases, elements, aliasKeys.radioDrivingLicenceTypesukFullAutomaticOnly);
  }

  async radioDrivingLicenceTypesukProvisional() {
  await this.actions.clickByAlias(aliases, elements, aliasKeys.radioDrivingLicenceTypesukProvisional);
  }

  async radioHasConvictionsQuestionno() {
  await this.actions.clickByAlias(aliases, elements, aliasKeys.radioHasConvictionsQuestionno);
  }

  async radioHasConvictionsQuestionyes() {
  await this.actions.clickByAlias(aliases, elements, aliasKeys.radioHasConvictionsQuestionyes);
  }

  async searchSelectTheConvictionCode(value: string) {
  await this.actions.fillByAlias(aliases, elements, aliasKeys.searchSelectTheConvictionCode, value);
  }

  async searchSelectTheConvictionCode2(value: string) {
  await this.actions.fillByAlias(aliases, elements, aliasKeys.searchSelectTheConvictionCode2, value);
  }

  async searchSelectTheConvictionCode3(value: string) {
  await this.actions.fillByAlias(aliases, elements, aliasKeys.searchSelectTheConvictionCode3, value);
  }

  async selectAddressLookupQuestionInput(value: string) {
  await this.actions.selectOptionByAlias(aliases, elements, aliasKeys.selectAddressLookupQuestionInput, value);
  }

  async selectDrivingExpirience(value: string) {
  await this.actions.selectOptionByAlias(aliases, elements, aliasKeys.selectDrivingExpirience, value);
  }

  async selectTitleQuestion(value: string) {
  await this.actions.selectOptionByAlias(aliases, elements, aliasKeys.selectTitleQuestion, value);
  }

  // </scanner:aliases>

  // You can add custom business logic methods below (safe zone).
}
