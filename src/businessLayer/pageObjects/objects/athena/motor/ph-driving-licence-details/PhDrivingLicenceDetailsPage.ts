// src/businessLayer/pageObjects/objects/athena/motor/ph-driving-licence-details/PhDrivingLicenceDetailsPage.ts
// pageKey: athena.motor.ph-driving-licence-details

import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { BasePage } from "@frameworkCore/automation/base";
import { elements } from "./elements";
import { aliases, aliasKeys } from "./aliases";
import { pageMeta } from "./aliases.generated";

const PAGE_KEY = "athena.motor.ph-driving-licence-details" as const;

export class PhDrivingLicenceDetailsPage extends BasePage {
  constructor(page: Page) {
    super(page, PAGE_KEY);
  }

  async waitUntilReady() {
    const readinessLocators: Locator[] = await Promise.all([
      this.resolveAliasLocator(aliases, elements, aliasKeys.inputFirstName).then((result) => result.locator),
      this.resolveAliasLocator(aliases, elements, aliasKeys.inputLastName).then((result) => result.locator),
      this.resolveAliasLocator(aliases, elements, aliasKeys.buttonNavigatorNext).then((result) => result.locator),
    ]);

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

  protected async clickAliasKey(aliasKey: keyof typeof aliases) {
    await this.actions.clickByAlias(aliases, elements, aliasKey);
  }

  protected async fillAliasKey(aliasKey: keyof typeof aliases, value: string) {
    await this.actions.fillByAlias(aliases, elements, aliasKey, value);
  }

  protected async selectAliasKey(aliasKey: keyof typeof aliases, value: string) {
    await this.actions.selectOptionByAlias(aliases, elements, aliasKey, value);
  }

  protected async setCheckedAliasKey(aliasKey: keyof typeof aliases, checked: boolean = true) {
    const { locator } = await this.resolveAliasLocator(aliases, elements, aliasKey);
    await locator.setChecked(checked);
  }

  // <scanner:aliases>
  // This region is auto-managed. Do not edit by hand.

  async buttonAddAnotherConviction() {
    await this.clickAliasKey(aliasKeys.buttonAddAnotherConviction);
  }

  async buttonFindAddress() {
    await this.clickAliasKey(aliasKeys.buttonFindAddress);
  }

  async buttonNavigatorBack() {
    await this.clickAliasKey(aliasKeys.buttonNavigatorBack);
  }

  async buttonNavigatorNext() {
    await this.clickAliasKey(aliasKeys.buttonNavigatorNext);
  }

  async groupRadioConviction0ResultedToABan() {
    await this.clickAliasKey(aliasKeys.groupRadioConviction0ResultedToABan);
  }

  async groupRadioConviction1ResultedToABan() {
    await this.clickAliasKey(aliasKeys.groupRadioConviction1ResultedToABan);
  }

  async groupRadioConviction2ResultedToABan() {
    await this.clickAliasKey(aliasKeys.groupRadioConviction2ResultedToABan);
  }

  async groupRadioDrivingLicenceHandy() {
    await this.clickAliasKey(aliasKeys.groupRadioDrivingLicenceHandy);
  }

  async groupRadioDrivingLicenceTypes() {
    await this.clickAliasKey(aliasKeys.groupRadioDrivingLicenceTypes);
  }

  async groupRadioHasConvictionsQuestion() {
    await this.clickAliasKey(aliasKeys.groupRadioHasConvictionsQuestion);
  }

  async inputAddressLookupWidgetAddressLookupQuestionInputBuilding(value: string) {
    await this.fillAliasKey(aliasKeys.inputAddressLookupWidgetAddressLookupQuestionInputBuilding, value);
  }

  async inputAddressLookupWidgetAddressLookupQuestionInputPostcode(value: string) {
    await this.fillAliasKey(aliasKeys.inputAddressLookupWidgetAddressLookupQuestionInputPostcode, value);
  }

  async inputConviction1DateMonth(value: string) {
    await this.fillAliasKey(aliasKeys.inputConviction1DateMonth, value);
  }

  async inputConviction1DateYear(value: string) {
    await this.fillAliasKey(aliasKeys.inputConviction1DateYear, value);
  }

  async inputConviction2DateMonth(value: string) {
    await this.fillAliasKey(aliasKeys.inputConviction2DateMonth, value);
  }

  async inputConviction2DateYear(value: string) {
    await this.fillAliasKey(aliasKeys.inputConviction2DateYear, value);
  }

  async inputConviction3DateMonth(value: string) {
    await this.fillAliasKey(aliasKeys.inputConviction3DateMonth, value);
  }

  async inputConviction3DateYear(value: string) {
    await this.fillAliasKey(aliasKeys.inputConviction3DateYear, value);
  }

  async inputDateOfBirthDay(value: string) {
    await this.fillAliasKey(aliasKeys.inputDateOfBirthDay, value);
  }

  async inputDateOfBirthMonth(value: string) {
    await this.fillAliasKey(aliasKeys.inputDateOfBirthMonth, value);
  }

  async inputDateOfBirthYear(value: string) {
    await this.fillAliasKey(aliasKeys.inputDateOfBirthYear, value);
  }

  async inputFirstName(value: string) {
    await this.fillAliasKey(aliasKeys.inputFirstName, value);
  }

  async inputLastName(value: string) {
    await this.fillAliasKey(aliasKeys.inputLastName, value);
  }

  async linkRemoveConviction() {
    await this.clickAliasKey(aliasKeys.linkRemoveConviction);
  }

  async linkRemoveConviction2() {
    await this.clickAliasKey(aliasKeys.linkRemoveConviction2);
  }

  async linkRemoveConviction3() {
    await this.clickAliasKey(aliasKeys.linkRemoveConviction3);
  }

  async linkToAllianzHomePage() {
    await this.clickAliasKey(aliasKeys.linkToAllianzHomePage);
  }

  async radioConviction0ResultedToABanno() {
    await this.clickAliasKey(aliasKeys.radioConviction0ResultedToABanno);
  }

  async radioConviction0ResultedToABanyes() {
    await this.clickAliasKey(aliasKeys.radioConviction0ResultedToABanyes);
  }

  async radioConviction1ResultedToABanno() {
    await this.clickAliasKey(aliasKeys.radioConviction1ResultedToABanno);
  }

  async radioConviction1ResultedToABanyes() {
    await this.clickAliasKey(aliasKeys.radioConviction1ResultedToABanyes);
  }

  async radioConviction2ResultedToABanno() {
    await this.clickAliasKey(aliasKeys.radioConviction2ResultedToABanno);
  }

  async radioConviction2ResultedToABanyes() {
    await this.clickAliasKey(aliasKeys.radioConviction2ResultedToABanyes);
  }

  async radioDrivingLicenceHandyno() {
    await this.clickAliasKey(aliasKeys.radioDrivingLicenceHandyno);
  }

  async radioDrivingLicenceHandyyes() {
    await this.clickAliasKey(aliasKeys.radioDrivingLicenceHandyyes);
  }

  async radioDrivingLicenceTypeseuFull() {
    await this.clickAliasKey(aliasKeys.radioDrivingLicenceTypeseuFull);
  }

  async radioDrivingLicenceTypeseuProvisional() {
    await this.clickAliasKey(aliasKeys.radioDrivingLicenceTypeseuProvisional);
  }

  async radioDrivingLicenceTypesother() {
    await this.clickAliasKey(aliasKeys.radioDrivingLicenceTypesother);
  }

  async radioDrivingLicenceTypesukFull() {
    await this.clickAliasKey(aliasKeys.radioDrivingLicenceTypesukFull);
  }

  async radioDrivingLicenceTypesukFullAutomaticOnly() {
    await this.clickAliasKey(aliasKeys.radioDrivingLicenceTypesukFullAutomaticOnly);
  }

  async radioDrivingLicenceTypesukProvisional() {
    await this.clickAliasKey(aliasKeys.radioDrivingLicenceTypesukProvisional);
  }

  async radioHasConvictionsQuestionno() {
    await this.clickAliasKey(aliasKeys.radioHasConvictionsQuestionno);
  }

  async radioHasConvictionsQuestionyes() {
    await this.clickAliasKey(aliasKeys.radioHasConvictionsQuestionyes);
  }

  async searchSelectTheConvictionCode(value: string) {
    await this.fillAliasKey(aliasKeys.searchSelectTheConvictionCode, value);
  }

  async searchSelectTheConvictionCode2(value: string) {
    await this.fillAliasKey(aliasKeys.searchSelectTheConvictionCode2, value);
  }

  async searchSelectTheConvictionCode3(value: string) {
    await this.fillAliasKey(aliasKeys.searchSelectTheConvictionCode3, value);
  }

  async selectAddressLookupQuestionInput(value: string) {
    await this.selectAliasKey(aliasKeys.selectAddressLookupQuestionInput, value);
  }

  async selectDrivingExpirience(value: string) {
    await this.selectAliasKey(aliasKeys.selectDrivingExpirience, value);
  }

  async selectTitleQuestion(value: string) {
    await this.selectAliasKey(aliasKeys.selectTitleQuestion, value);
  }

  // </scanner:aliases>

  // You can add custom business logic methods below (safe zone).
}
