// src/execution/scenario/templateValidator.ts

import { normalizeSpaces } from "../../utils/text";
import { defaultScenarioTemplateConfig } from "./templateConfig";
import type { RawScenarioRow } from "./types";

function normKey(value: unknown): string {
    return normalizeSpaces(String(value ?? ""))
        .toLowerCase()
        .replace(/\s+/g, "");
}

function getString(row: RawScenarioRow, key: string): string {
    return normalizeSpaces(String(row[key] ?? ""));
}

function getStepValue(
    row: RawScenarioRow,
    stepNo: number,
    suffix: string
): string {
    return getString(row, `Step${stepNo}${suffix}`);
}

function getTotalSteps(row: RawScenarioRow): number {
    const raw = getString(row, "TotalSteps");
    const num = Number(raw);
    return Number.isInteger(num) ? num : 0;
}

function validateBaseFields(row: RawScenarioRow): string[] {
    const errors: string[] = [];
    const cfg = defaultScenarioTemplateConfig;

    cfg.requiredBaseHeaders.forEach((header) => {
        if (!getString(row, header)) {
            errors.push(`Missing required field: ${header}`);
        }
    });

    const startFrom = normKey(row.StartFrom);
    const conditional =
        startFrom === "existingpolicy"
            ? cfg.conditionalBaseHeaders.existingPolicy
            : cfg.conditionalBaseHeaders.newBusiness;

    conditional.forEach((header) => {
        if (!getString(row, header)) {
            errors.push(`Missing required field for StartFrom=${row.StartFrom}: ${header}`);
        }
    });

    const totalSteps = getTotalSteps(row);
    if (totalSteps <= 0) {
        errors.push("TotalSteps must be a positive integer");
    }

    if (totalSteps > cfg.maxSteps) {
        errors.push(`TotalSteps must not exceed ${cfg.maxSteps}`);
    }

    return errors;
}

function validatePortal(stepNo: number, portal: string): string[] {
    const errors: string[] = [];
    const normalized = normKey(portal);

    if (!normalized) {
        errors.push(`Step${stepNo}: Portal is required`);
        return errors;
    }

    if (normalized !== "customerportal" && normalized !== "supportportal") {
        errors.push(
            `Step${stepNo}: Portal must be CustomerPortal or SupportPortal`
        );
    }

    return errors;
}

function validateStep(row: RawScenarioRow, stepNo: number): string[] {
    const errors: string[] = [];
    const action = getStepValue(row, stepNo, "Action");
    const subType = getStepValue(row, stepNo, "SubType");
    const portal = getStepValue(row, stepNo, "Portal");
    const testCaseId = getStepValue(row, stepNo, "TestCaseId");

    if (!action) errors.push(`Step${stepNo}: Action is required`);
    errors.push(...validatePortal(stepNo, portal));

    if (!testCaseId) {
        errors.push(`Step${stepNo}: TestCaseId is required`);
    }

    if (normKey(action) !== "newbusiness" && !subType) {
        errors.push(`Step${stepNo}: SubType is required for action ${action}`);
    }

    return errors;
}

export function validateScenarioTemplateRow(row: RawScenarioRow): string[] {
    const errors: string[] = [];
    errors.push(...validateBaseFields(row));

    const totalSteps = getTotalSteps(row);
    if (totalSteps <= 0) return errors;

    for (let stepNo = 1; stepNo <= totalSteps; stepNo++) {
        errors.push(...validateStep(row, stepNo));
    }

    return errors;
}

export function validateScenarioTemplateRows(
    rows: RawScenarioRow[]
): Array<{ scenarioId: string; errors: string[] }> {
    return rows.map((row) => ({
        scenarioId: getString(row, "ScenarioId") || "(missing)",
        errors: validateScenarioTemplateRow(row),
    }));
}