// src/execution/modes/e2e/scenario/e2EPipelineTemplateValidator.ts

import { normalizeSpaces } from "@utils/text";
import { defaultE2EPipelineTemplateConfig } from "./e2EPipelineTemplateConfig";
import type { RawScenarioRow } from "./types";

function normKey(value: unknown): string {
    return normalizeSpaces(String(value ?? ""))
        .toLowerCase()
        .replace(/\s+/g, "");
}

function getString(row: RawScenarioRow, key: string): string {
    return normalizeSpaces(String(row[key] ?? ""));
}

function getStepValue(row: RawScenarioRow, stepNo: number, suffix: string): string {
    return getString(row, `Step${stepNo}${suffix}`);
}

function getTotalSteps(row: RawScenarioRow): number {
    const raw = getString(row, "TotalSteps");
    const num = Number(raw);
    return Number.isInteger(num) ? num : 0;
}

function missingHeaders(
    actualHeaders: string[],
    expectedHeaders: string[]
): string[] {
    const actual = new Set(actualHeaders.map(normKey));
    return expectedHeaders.filter((header) => !actual.has(normKey(header)));
}

function isDirectJourney(row: RawScenarioRow): boolean {
    return normKey(row.Journey) === "direct";
}

function isExistingPolicy(row: RawScenarioRow): boolean {
    return normKey(row.PolicyContext) === "existingpolicy";
}

function isNewBusiness(row: RawScenarioRow): boolean {
    return normKey(row.PolicyContext) === "newbusiness";
}

function validateEntryPointValue(row: RawScenarioRow): string[] {
    const entryPoint = normKey(row.EntryPoint);
    const journey = normKey(row.Journey);

    if (isExistingPolicy(row)) {
        return [];
    }

    if (!isNewBusiness(row)) {
        return [`Invalid PolicyContext value: ${getString(row, "PolicyContext")}`];
    }

    if (journey === "direct") {
        if (!entryPoint || entryPoint === "direct") {
            return [];
        }

        return [`EntryPoint must be blank or Direct when Journey is Direct`];
    }

    if (!entryPoint) {
        return [`EntryPoint is required when Journey is not Direct for NewBusiness`];
    }

    if (entryPoint !== "pcw" && entryPoint !== "pcwtool") {
        return [`EntryPoint must be PCW or PCWTool when Journey is not Direct`];
    }

    return [];
}

export function validateE2EPipelineTemplateHeaders(headers: string[]): string[] {
    const cfg = defaultE2EPipelineTemplateConfig;
    const requiredStep1Headers = cfg.stepFieldSuffixes.map(
        (suffix) => `Step1${suffix}`
    );

    return [
        ...missingHeaders(headers, cfg.requiredBaseHeaders),
        ...missingHeaders(headers, requiredStep1Headers),
    ].map((name) => `Missing required header: ${name}`);
}

function validateBaseFields(row: RawScenarioRow): string[] {
    const errors: string[] = [];
    const cfg = defaultE2EPipelineTemplateConfig;

    cfg.requiredBaseHeaders.forEach((header) => {
        if (!getString(row, header)) {
            if (header === "EntryPoint" && isExistingPolicy(row)) {
                return;
            }

            if (header === "EntryPoint" && isNewBusiness(row) && isDirectJourney(row)) {
                return;
            }

            errors.push(`Missing required field: ${header}`);
        }
    });

    const conditional = isExistingPolicy(row)
        ? cfg.conditionalBaseHeaders.existingPolicy
        : cfg.conditionalBaseHeaders.newBusiness;

    conditional.forEach((header) => {
        if (!getString(row, header)) {
            errors.push(
                `Missing required field for PolicyContext=${row.PolicyContext}: ${header}`
            );
        }
    });

    errors.push(...validateEntryPointValue(row));

    const totalSteps = getTotalSteps(row);
    if (totalSteps <= 0) errors.push("TotalSteps must be a positive integer");
    if (totalSteps > cfg.maxSteps) {
        errors.push(`TotalSteps must not exceed ${cfg.maxSteps}`);
    }

    return errors;
}

function validatePortal(stepNo: number, portal: string): string[] {
    const normalized = normKey(portal);
    if (!normalized) return [`Step${stepNo}: Portal is required`];
    if (normalized !== "customerportal" && normalized !== "supportportal") {
        return [`Step${stepNo}: Portal must be CustomerPortal or SupportPortal`];
    }
    return [];
}

function validateStep(row: RawScenarioRow, stepNo: number): string[] {
    const errors: string[] = [];
    const action = getStepValue(row, stepNo, "Action");
    const subType = getStepValue(row, stepNo, "SubType");
    const portal = getStepValue(row, stepNo, "Portal");
    const testCaseId = getStepValue(row, stepNo, "TestCaseId");

    if (!action) errors.push(`Step${stepNo}: Action is required`);
    errors.push(...validatePortal(stepNo, portal));
    if (!testCaseId) errors.push(`Step${stepNo}: TestCaseId is required`);

    if (normKey(action) !== "newbusiness" && !subType) {
        errors.push(`Step${stepNo}: SubType is required for action ${action}`);
    }

    return errors;
}

export function validateE2EPipelineTemplateRow(row: RawScenarioRow): string[] {
    const errors = validateBaseFields(row);
    const totalSteps = getTotalSteps(row);
    if (totalSteps <= 0) return errors;

    for (let stepNo = 1; stepNo <= totalSteps; stepNo++) {
        errors.push(...validateStep(row, stepNo));
    }

    return errors;
}

export function validateE2EPipelineTemplateRows(
    rows: RawScenarioRow[]
): Array<{ scenarioId: string; errors: string[] }> {
    return rows.map((row) => ({
        scenarioId: getString(row, "ScenarioId") || "(missing)",
        errors: validateE2EPipelineTemplateRow(row),
    }));
}