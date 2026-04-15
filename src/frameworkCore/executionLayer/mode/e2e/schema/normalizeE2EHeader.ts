// src/frameworkCore/executionLayer/mode/e2e/schema/normalizeE2EHeader.ts

import { normalizeHeaderKey } from "@utils/text";
import { E2E_HEADER_ALIASES } from "./e2eHeaderAliases";
import { E2E_HEADERS } from "./e2eHeaders";

function buildCanonicalHeaderMap(maxItems = 20): Map<string, string> {
    const map = new Map<string, string>();

    const baseHeaders = [
        E2E_HEADERS.SCENARIO_ID,
        E2E_HEADERS.SCENARIO_NAME,
        E2E_HEADERS.PLATFORM,
        E2E_HEADERS.APPLICATION,
        E2E_HEADERS.PRODUCT,
        E2E_HEADERS.JOURNEY_START_WITH,
        E2E_HEADERS.POLICY_NUMBER,
        E2E_HEADERS.LOGIN_ID,
        E2E_HEADERS.PASSWORD,
        E2E_HEADERS.DESCRIPTION,
        E2E_HEADERS.EXECUTE,
        E2E_HEADERS.TOTAL_ITEMS,
    ];

    baseHeaders.forEach((header) => {
        map.set(normalizeHeaderKey(header), header);
    });

    for (let itemNo = 1; itemNo <= maxItems; itemNo++) {
        const item = E2E_HEADERS.item(itemNo);

        [item.ACTION, item.SUB_TYPE, item.PORTAL, item.TEST_CASE_REF].forEach(
            (header) => {
                map.set(normalizeHeaderKey(header), header);
            }
        );
    }

    Object.entries(E2E_HEADER_ALIASES).forEach(([incoming, canonical]) => {
        map.set(normalizeHeaderKey(incoming), canonical);
    });

    return map;
}

const CANONICAL_HEADER_MAP = buildCanonicalHeaderMap();

export function normalizeE2EHeader(header: string): string {
    return CANONICAL_HEADER_MAP.get(normalizeHeaderKey(header)) ?? header;
}