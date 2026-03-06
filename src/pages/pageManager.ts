// src/pages/pageManager.ts
import type { Page } from "@playwright/test";
import { CarDetailsPage } from "./motor/car-details/CarDetailsPage";


/**
 * Enterprise PageManager / Factory
 * - Single place to construct Page Objects
 * - Prevents import duplication across tests/flows
 * - Keeps everything strongly typed
 */
export class PageManager {
    readonly page: Page;

    // Lazy cache (each page object is created only once per test)
    private cache = new Map<string, any>();

    constructor(page: Page) {
        this.page = page;
    }

    /** Create/get cached instance by key */
    private get<T>(key: string, factory: () => T): T {
        if (!this.cache.has(key)) {
            this.cache.set(key, factory());
        }
        return this.cache.get(key) as T;
    }

    get motor() {
        return {
            carDetails: this.get("motor.carDetails", () => new CarDetailsPage(this.page)),
        };
    }

}
