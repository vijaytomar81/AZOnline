import { test } from "@playwright/test";
import { LoginRegistrationPage } from "../../pages/athena_customer_portal/LoginRegistrationPage";

test.describe("Athena Customer Portal - Login/Register Landing", () => {
    test("should show Login / Register / Skip link", async ({ page }) => {
        const landing = new LoginRegistrationPage(page);

        // relies on baseURL from playwright.config.ts
        await landing.goto("/");
        await landing.assertVisible();
    });
});