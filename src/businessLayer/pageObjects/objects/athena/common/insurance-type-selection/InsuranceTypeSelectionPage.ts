// src/businessLayer/pageObjects/objects/athena/common/insurance-type-selection/InsuranceTypeSelectionPage.ts
// pageKey: athena.common.insurance-type-selection

import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { BasePage } from "@frameworkCore/automation/base";
import { elements } from "./elements";
import { aliases, aliasKeys } from "./aliases";
import { pageMeta } from "./aliases.generated";

const PAGE_KEY = "athena.common.insurance-type-selection" as const;

export class InsuranceTypeSelectionPage extends BasePage {
  constructor(page: Page) {
    super(page, PAGE_KEY);
  }

  async waitUntilReady() {
    const readinessLocators: Locator[] = await Promise.all([
      this.resolveAliasLocator(aliases, elements, aliasKeys.linkCarQuote).then((result) => result.locator),
      this.resolveAliasLocator(aliases, elements, aliasKeys.linkHomeQuote).then((result) => result.locator),
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

  async buttonInputBack() {
  await this.clickAliasKey(aliasKeys.buttonInputBack);
  }

  async linkCarQuote() {
  await this.clickAliasKey(aliasKeys.linkCarQuote);
  }

  async linkHomeQuote() {
  await this.clickAliasKey(aliasKeys.linkHomeQuote);
  }

  async linkInputBack() {
  await this.clickAliasKey(aliasKeys.linkInputBack);
  }

  async linkLetUsKnow() {
  await this.clickAliasKey(aliasKeys.linkLetUsKnow);
  }

  async linkTermsAndConditionsApply() {
  await this.clickAliasKey(aliasKeys.linkTermsAndConditionsApply);
  }

  async linkToAllianzHomePage() {
  await this.clickAliasKey(aliasKeys.linkToAllianzHomePage);
  }

  // </scanner:aliases>

  // You can add custom business logic methods below (safe zone).
}
