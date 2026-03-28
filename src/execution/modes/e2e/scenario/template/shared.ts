// src/execution/modes/e2e/scenario/template/shared.ts

import { normalizeSpaces } from "@utils/text";
import type { RawScenarioRow } from "../types";

export function normalizeTemplateKey(value: unknown): string {
    return normalizeSpaces(String(value ?? ""))
        .toLowerCase()
        .replace(/\s+/g, "");
}

export function getTemplateString(
    row: RawScenarioRow,
    key: string
): string {
    return normalizeSpaces(String(row[key] ?? ""));
}

export function getTemplateStepValue(
    row: RawScenarioRow,
    stepNo: number,
    suffix: string
): string {
    return getTemplateString(row, `Step${stepNo}${suffix}`);
}

export function getTemplateTotalSteps(row: RawScenarioRow): number {
    const raw = getTemplateString(row, "TotalSteps");
    const num = Number(raw);

    return Number.isInteger(num) ? num : 0;
}

export function isTemplateDirectJourney(row: RawScenarioRow): boolean {
    return normalizeTemplateKey(row.Journey) === "direct";
}

export function isTemplateExistingPolicy(row: RawScenarioRow): boolean {
    return normalizeTemplateKey(row.PolicyContext) === "existingpolicy";
}

export function isTemplateNewBusiness(row: RawScenarioRow): boolean {
    return normalizeTemplateKey(row.PolicyContext) === "newbusiness";
}
