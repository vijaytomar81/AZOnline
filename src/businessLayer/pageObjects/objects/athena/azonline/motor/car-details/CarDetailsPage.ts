// src/businessLayer/pageObjects/objects/athena/azonline/motor/car-details/CarDetailsPage.ts
// pageKey: athena.azonline.motor.car-details

import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { BasePage } from "@frameworkCore/automation/base";
import { elements } from "./elements";
import { aliases, aliasKeys } from "./aliases";
import { pageMeta } from "./aliases.generated";

const PAGE_KEY = "athena.azonline.motor.car-details" as const;

export class CarDetailsPage extends BasePage {
  constructor(page: Page) {
    super(page, PAGE_KEY);
  }

  async waitUntilReady() {
    const readinessLocators: Locator[] = await Promise.all([
      this.resolveAliasLocator(aliases, elements, aliasKeys.inputRegistrationNumber).then((result) => result.locator),
      this.resolveAliasLocator(aliases, elements, aliasKeys.groupRadioRegistrationNumberPolarQuestion).then((result) => result.locator),
      this.resolveAliasLocator(aliases, elements, aliasKeys.radioRegistrationNumberPolarQuestionNo).then((result) => result.locator),
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

  async buttonFindMyCar() {
  await this.clickAliasKey(aliasKeys.buttonFindMyCar);
  }

  async groupRadioRegistrationNumberPolarQuestion() {
  await this.clickAliasKey(aliasKeys.groupRadioRegistrationNumberPolarQuestion);
  }

  async inputRegistrationNumber(value: string) {
  await this.fillAliasKey(aliasKeys.inputRegistrationNumber, value);
  }

  async linkPersonalInfoUse() {
  await this.clickAliasKey(aliasKeys.linkPersonalInfoUse);
  }

  async linkToAllianzHomePage() {
  await this.clickAliasKey(aliasKeys.linkToAllianzHomePage);
  }

  async radioRegistrationNumberPolarQuestionNo() {
  await this.clickAliasKey(aliasKeys.radioRegistrationNumberPolarQuestionNo);
  }

  async radioRegistrationNumberPolarQuestionYes() {
  await this.clickAliasKey(aliasKeys.radioRegistrationNumberPolarQuestionYes);
  }

  // </scanner:aliases>

  // You can add custom business logic methods below (safe zone).
}
