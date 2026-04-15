// src/businessLayer/pageObjects/objects/athena/common/manage-cookies/ManageCookiesPage.ts
// pageKey: athena.common.manage-cookies

import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { BasePage } from "@frameworkCore/automation/base";
import { elements } from "./elements";
import { aliases, aliasKeys } from "./aliases";
import { pageMeta } from "./aliases.generated";

const PAGE_KEY = "athena.common.manage-cookies" as const;

export class ManageCookiesPage extends BasePage {
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

  async buttonAcceptAll() {
  await this.clickAliasKey(aliasKeys.buttonAcceptAll);
  }

  async buttonManageCookies() {
  await this.clickAliasKey(aliasKeys.buttonManageCookies);
  }

  async buttonRejectAll() {
  await this.clickAliasKey(aliasKeys.buttonRejectAll);
  }

  async linkReferToOurCookiePolicy() {
  await this.clickAliasKey(aliasKeys.linkReferToOurCookiePolicy);
  }

  // </scanner:aliases>

  // You can add custom business logic methods below (safe zone).
}
