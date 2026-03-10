// src/pages/motor/car-details/CarDetailsPage.ts
// AUTO-SCAFFOLDED (create-only) by src/tools/page-elements-generator/builders/buildPageTsStub.ts
// pageKey: motor.car-details

import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { basePage } from "../../../core/basePage"; // adjust if needed
import { elements } from "./elements";
import { aliases } from "./aliases";
import { pageMeta } from "./aliases.generated";
import type { AliasKey } from "./aliases";

const PAGE_KEY = "motor.car-details" as const;

export class CarDetailsPage extends basePage {
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

  async allDone() {
  await this.clickAlias("allDone");
  }

  async automatic() {
  await this.clickAlias("automatic");
  }

  async back() {
  await this.clickAlias("back");
  }

  async diesel() {
  await this.clickAlias("diesel");
  }

  async findMyCar() {
  await this.clickAlias("findMyCar");
  }

  async linkToAllianzHomePage() {
  await this.clickAlias("linkToAllianzHomePage");
  }

  async manual() {
  await this.clickAlias("manual");
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

  async petrol() {
  await this.clickAlias("petrol");
  }

  async purchaseMonthInputField(value: string) {
  await this.fillAlias("purchaseMonthInputField", value);
  }

  async purchaseYearInputField(value: string) {
  await this.fillAlias("purchaseYearInputField", value);
  }

  async startTypingTheMakeOfYourVehicle(value: string) {
  await this.fillAlias("startTypingTheMakeOfYourVehicle", value);
  }

  async startTypingTheModelNameOfYourVehicle(value: string) {
  await this.fillAlias("startTypingTheModelNameOfYourVehicle", value);
  }

  async startTypingTheModelNameOfYourVehicle2(value: string) {
  await this.fillAlias("startTypingTheModelNameOfYourVehicle2", value);
  }

  async theCarHasnTBeenBoughtYet(checked: boolean = true) {
  await this.setCheckedAlias("theCarHasnTBeenBoughtYet", checked);
  }

  async uploadAPhotoOfYourCarSNumberPlate(value: string) {
  await this.fillAlias("uploadAPhotoOfYourCarSNumberPlate", value);
  }

  async vehicleDoors(value: string) {
  await this.selectOptionAlias("vehicleDoors", value);
  }

  async vehicleManufactureYear(value: string) {
  await this.selectOptionAlias("vehicleManufactureYear", value);
  }

  async viewHowWeLlUseYourInfo() {
  await this.clickAlias("viewHowWeLlUseYourInfo");
  }

  async whatSYourCarRegistrationNumber(value: string) {
  await this.fillAlias("whatSYourCarRegistrationNumber", value);
  }

  async yes() {
  await this.clickAlias("yes");
  }

  async yes2() {
  await this.clickAlias("yes2");
  }

  // </scanner:aliases>

  // You can add custom business logic methods below (safe zone).
}
