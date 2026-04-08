// src/frameworkCore/executionLayer/mode/e2e/schema/e2eHeaderAliases.ts

import { E2E_HEADERS } from "./e2eHeaders";

function buildItemAliases(maxItems = 20): Record<string, string> {
    const aliases: Record<string, string> = {};

    for (let itemNo = 1; itemNo <= maxItems; itemNo++) {
        aliases[`Item${itemNo}TestCaseId`] =
            E2E_HEADERS.item(itemNo).TEST_CASE_REF;
    }

    return aliases;
}

export const E2E_HEADER_ALIASES: Record<string, string> = {
    ...buildItemAliases(),

    JourneyStart: E2E_HEADERS.JOURNEY_START_WITH,
    JourneyStartWith: E2E_HEADERS.JOURNEY_START_WITH,
    PolicyStart: E2E_HEADERS.JOURNEY_START_WITH,
    PolicyState: E2E_HEADERS.JOURNEY_START_WITH,
    StartState: E2E_HEADERS.JOURNEY_START_WITH,
};
