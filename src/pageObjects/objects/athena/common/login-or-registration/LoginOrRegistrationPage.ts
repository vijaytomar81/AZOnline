// src/pageObjects/objects/athena/common/login-or-registration/LoginOrRegistrationPage.ts
// pageKey: athena.common.login-or-registration

import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { BasePage } from "@automation/base";
import { elements } from "./elements";
import { aliases } from "./aliases";
import { pageMeta } from "./aliases.generated";

const PAGE_KEY = "athena.common.login-or-registration" as const;

export class LoginOrRegistrationPage extends BasePage {
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

  async linkToAllianzHomePage() {
  await this.actions.clickByAlias(aliases, elements, "linkToAllianzHomePage");
  }

  async logIn() {
  await this.actions.clickByAlias(aliases, elements, "logIn");
  }

  async register() {
  await this.actions.clickByAlias(aliases, elements, "register");
  }

  async skipThisStepILlRegisterLater() {
  await this.actions.clickByAlias(aliases, elements, "skipThisStepILlRegisterLater");
  }

  // </scanner:aliases>

  // You can add custom business logic methods below (safe zone).
}
