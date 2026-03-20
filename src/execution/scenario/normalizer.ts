// src/execution/scenario/normalizer.ts

import { normalizeSpaces } from "../../utils/text";
import type {
    ExecutionScenario,
    RawScenarioRow,
    ScenarioStartFrom,
    ScenarioStep,
} from "./types";
import { defaultScenarioTemplateConfig } from "./templateConfig";

function getString(value: unknown): string {
    return normalizeSpaces(String(value ?? ""));
}

function normalizeKey(value: unknown): string {
    return getString(value).toLowerCase().replace(/\s+/g, "");
}

function normalizeStartFrom(value: unknown): ScenarioStartFrom {
    return normalizeKey(value) === "existingpolicy"
        ? "ExistingPolicy"
        : "NewBusiness";
}

function normalizeExecute(value: unknown): boolean {
    return normalizeKey(value) !== "n";
}

function getTotalSteps(value: unknown): number {
    const num = Number(getString(value));
    if (!Number.isInteger(num) || num < 0) return 0;
    return Math.min(num, defaultScenarioTemplateConfig.maxSteps);
}

function getStepField(
    row: RawScenarioRow,
    stepNo: number,
    suffix: string
): string {
    return getString(row[`Step${stepNo}${suffix}`]);
}

function buildStep(row: RawScenarioRow, stepNo: number): ScenarioStep {
    return {
        stepNo,
        action: getStepField(row, stepNo, "Action"),
        subType: getStepField(row, stepNo, "SubType") || undefined,
        portal: getStepField(row, stepNo, "Portal"),
        testCaseId: getStepField(row, stepNo, "TestCaseId"),
    };
}

function buildSteps(row: RawScenarioRow, totalSteps: number): ScenarioStep[] {
    const steps: ScenarioStep[] = [];

    for (let stepNo = 1; stepNo <= totalSteps; stepNo++) {
        steps.push(buildStep(row, stepNo));
    }

    return steps;
}

export function normalizeScenario(row: RawScenarioRow): ExecutionScenario {
    const totalSteps = getTotalSteps(row.TotalSteps);

    return {
        scenarioId: getString(row.ScenarioId),
        scenarioName: getString(row.ScenarioName),
        journey: getString(row.Journey),
        startFrom: normalizeStartFrom(row.StartFrom),
        policyNumber: getString(row.PolicyNumber) || undefined,
        loginId: getString(row.LoginId) || undefined,
        password: getString(row.Password) || undefined,
        description: getString(row.Description),
        execute: normalizeExecute(row.Execute),
        totalSteps,
        steps: buildSteps(row, totalSteps),
    };
}

export function normalizeScenarios(rows: RawScenarioRow[]): ExecutionScenario[] {
    return rows.map(normalizeScenario);
}