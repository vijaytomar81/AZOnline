// src/executionLayer/mode/e2e/scenario/template/shared.ts

import { normalizeSpaces } from "@utils/text";
import type { RawExecutionScenarioRow } from "../types";

export function normalizeTemplateKey(value: unknown): string {
    return normalizeSpaces(String(value ?? ""))
        .toLowerCase()
        .replace(/\s+/g, "");
}

export function getTemplateString(
    row: RawExecutionScenarioRow,
    key: string
): string {
    return normalizeSpaces(String(row[key] ?? ""));
}

export function getExecutionItemField(
    row: RawExecutionScenarioRow,
    itemNo: number,
    suffix: string
): string {
    return getTemplateString(row, `Item${itemNo}${suffix}`);
}

export function getTemplateTotalItems(
    row: RawExecutionScenarioRow
): number {
    const raw = getTemplateString(row, "TotalItems");
    const num = Number(raw);

    return Number.isInteger(num) ? num : 0;
}

export function isExistingPolicy(row: RawExecutionScenarioRow): boolean {
    return normalizeTemplateKey(row.PolicyContext) === "existingpolicy";
}

export function isNewBusiness(row: RawExecutionScenarioRow): boolean {
    return normalizeTemplateKey(row.PolicyContext) === "newbusiness";
}

export function isDirectJourney(row: RawExecutionScenarioRow): boolean {
    return normalizeTemplateKey(row.Journey) === "direct";
}
