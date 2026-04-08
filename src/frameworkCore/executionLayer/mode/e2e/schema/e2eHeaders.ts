// src/frameworkCore/executionLayer/mode/e2e/schema/e2eHeaders.ts

export const E2E_HEADERS = {
    SCENARIO_ID: "ScenarioId",
    SCENARIO_NAME: "ScenarioName",

    PLATFORM: "Platform",
    APPLICATION: "Application",
    PRODUCT: "Product",
    JOURNEY_START_WITH: "JourneyStartWith",

    POLICY_NUMBER: "PolicyNumber",
    LOGIN_ID: "LoginId",
    PASSWORD: "Password",
    DESCRIPTION: "Description",
    EXECUTE: "Execute",
    TOTAL_ITEMS: "TotalItems",

    item(itemNo: number) {
        return {
            ACTION: `Item${itemNo}Action`,
            SUB_TYPE: `Item${itemNo}SubType`,
            PORTAL: `Item${itemNo}Portal`,
            TEST_CASE_REF: `Item${itemNo}TestCaseRef`,
        };
    },
} as const;