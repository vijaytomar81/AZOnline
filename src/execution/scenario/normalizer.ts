// src/execution/scenario/normalizer.ts

import { normalizeSpaces } from "../../utils/text";
import type {
    ExecutionScenario,
    RawScenarioRow,
    ScenarioStartFrom,
    ScenarioStep,
} from "./types";

const MAX_STEPS = 20;

function getString(value: unknown): string | undefined {
    if (value === undefined || value === null) return undefined;
    const text = normalizeSpaces(String(value));
    return text || undefined;
}

function normalizeStartFrom(value: unknown): ScenarioStartFrom {
    const normalized = getString(value)?.toLowerCase();

    if (normalized === "existingpolicy") {
        return "ExistingPolicy";
    }

    return "NewBusiness";
}

function normalizeExecute(value: unknown): boolean {
    const normalized = getString(value)?.toUpperCase();
    return normalized !== "N";
}

function getStepField(row: RawScenarioRow, stepNo: number, suffix: string): string | undefined {
    return getString(row[`Step${stepNo}${suffix}`]);
}

function buildStep(row: RawScenarioRow, stepNo: number): ScenarioStep | null {
    const action = getStepField(row, stepNo, "Action");
    if (!action) return null;

    return {
        stepNo,
        action,
        subType: getStepField(row, stepNo, "SubType"),
        portal: getStepField(row, stepNo, "Portal"),
        dataRef: getStepField(row, stepNo, "Data"),
    };
}

function buildSteps(row: RawScenarioRow): ScenarioStep[] {
    const steps: ScenarioStep[] = [];

    for (let stepNo = 1; stepNo <= MAX_STEPS; stepNo++) {
        const step = buildStep(row, stepNo);
        if (!step) continue;
        steps.push(step);
    }

    return steps;
}

export function normalizeScenario(row: RawScenarioRow): ExecutionScenario {
    return {
        scenarioId: getString(row.ScenarioId) ?? "",
        scenarioName: getString(row.ScenarioName) ?? "",
        journey: getString(row.Journey) ?? "",
        startFrom: normalizeStartFrom(row.StartFrom),
        policyNumber: getString(row.PolicyNumber),
        description: getString(row.Description),
        execute: normalizeExecute(row.Execute),
        steps: buildSteps(row),
    };
}

export function normalizeScenarios(rows: RawScenarioRow[]): ExecutionScenario[] {
    return rows.map(normalizeScenario);
}