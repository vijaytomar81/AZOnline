// AUTO-SCAFFOLDED (create-only) by src/scanner/elements-generator
// pageKey: motor.car-details

import type { Page } from "@playwright/test";
import { BasePage } from "../../core/BasePage"; // adjust if needed
import { elements } from "./elements";
import { aliases } from "./aliases";
import type { AliasKey } from "./aliases";

const PAGE_KEY = "motor.car-details" as const;

export class CarDetailsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // --------------------------------------------------
  // Alias wrappers (so generated methods stay simple)
  // --------------------------------------------------

  protected async clickAlias(aliasKey: AliasKey) {
    await this.clickByAlias(PAGE_KEY, aliases, elements, aliasKey);
  }

  protected async fillAlias(aliasKey: AliasKey, value: string) {
    await this.fillByAlias(PAGE_KEY, aliases, elements, aliasKey, value);
  }

  protected async selectOptionAlias(aliasKey: AliasKey, value: string) {
    await this.selectOptionByAlias(PAGE_KEY, aliases, elements, aliasKey, value);
  }

  protected async setCheckedAlias(aliasKey: AliasKey, checked: boolean = true) {
    const { locator } = await this.resolveByAlias(PAGE_KEY, aliases, elements, aliasKey);
    await locator.setChecked(checked, { timeout: Number(process.env.ACTION_TIMEOUT ?? 10_000) });
  }

      // <scanner:aliases>
  // This region is auto-managed. Do not edit by hand.

  async allDone() {
    await this.clickAlias("allDone");
  }

  async back() {
    await this.clickAlias("back");
  }

  async findMyCar() {
    await this.clickAlias("findMyCar");
  }

  async hasmodificationFalseNo() {
    await this.clickAlias("hasmodificationFalseNo");
  }

  async hasmodificationTrueYes() {
    await this.clickAlias("hasmodificationTrueYes");
  }

  async linkToAllianzHomePage() {
    await this.clickAlias("linkToAllianzHomePage");
  }

  async next() {
    await this.clickAlias("next");
  }

  async purchaseMonthInputField(value: string) {
    await this.fillAlias("purchaseMonthInputField", value);
  }

  async purchaseYearInputField(value: string) {
    await this.fillAlias("purchaseYearInputField", value);
  }

  async registrationnumberpolarquestionNo() {
    await this.clickAlias("registrationnumberpolarquestionNo");
  }

  async registrationnumberpolarquestionYes() {
    await this.clickAlias("registrationnumberpolarquestionYes");
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

  async vehicledetailssetcorrectlyNo() {
    await this.clickAlias("vehicledetailssetcorrectlyNo");
  }

  async vehicledetailssetcorrectlyYes() {
    await this.clickAlias("vehicledetailssetcorrectlyYes");
  }

  async vehicleDoors(value: string) {
    await this.selectOptionAlias("vehicleDoors", value);
  }

  async vehiclefueltypedDiesel() {
    await this.clickAlias("vehiclefueltypedDiesel");
  }

  async vehiclefueltypepPetrol() {
    await this.clickAlias("vehiclefueltypepPetrol");
  }

  async vehicleManufactureYear(value: string) {
    await this.selectOptionAlias("vehicleManufactureYear", value);
  }

  async vehicletransmissionaAutomatic() {
    await this.clickAlias("vehicletransmissionaAutomatic");
  }

  async vehicletransmissionmManual() {
    await this.clickAlias("vehicletransmissionmManual");
  }

  async viewHowWeLlUseYourInfo() {
    await this.clickAlias("viewHowWeLlUseYourInfo");
  }

  async whatSYourCarRegistrationNumber(value: string) {
    await this.fillAlias("whatSYourCarRegistrationNumber", value);
  }

  // </scanner:aliases>

  // You can add custom business logic methods below (safe zone).
}
