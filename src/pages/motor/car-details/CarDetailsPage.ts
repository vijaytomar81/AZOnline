// AUTO-SCAFFOLDED (create-only) by src/scanner/generateElements.ts
// pageKey: motor.car-details

import type { Page } from "@playwright/test";
import { BasePage } from "../../core/BasePage"; // adjust if needed
import { elements } from "./elements";
import type { ElementKey } from "./elements";

const PAGE_KEY = "motor.car-details" as const;

export class CarDetailsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // --- key-aware helpers (self-heal capable) ---
  async click<K extends ElementKey>(key: K) {
    await this.clickByKey(PAGE_KEY, String(key), elements[key]);
  }

  async fill<K extends ElementKey>(key: K, value: string) {
    await this.fillByKey(PAGE_KEY, String(key), elements[key], value);
  }

  async selectOption<K extends ElementKey>(key: K, value: string) {
    await this.selectOptionByKey(PAGE_KEY, String(key), elements[key], value);
  }
}
