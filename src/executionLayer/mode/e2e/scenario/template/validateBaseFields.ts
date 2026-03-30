// src/executionLayer/mode/e2e/scenario/template/validateBaseFields.ts

import type { RawExecutionScenarioRow } from "../types";
import {
    getTemplateString,
    getTemplateTotalItems,
    isDirectJourney,
    isExistingPolicy,
    isNewBusiness,
} from "./shared";
import { validateEntryPointValue } from "./validateEntryPointValue";

export function validateBaseFields(
    row: RawExecutionScenarioRow
): string[] {
    const errors: string[] = [];
    const requiredBaseHeaders = [
        "ScenarioId",
        "ScenarioName",
        "Journey",
        "PolicyContext",
        "EntryPoint",
        "Description",
        "Execute",
        "TotalItems",
    ];

    requiredBaseHeaders.forEach((header) => {
        if (!getTemplateString(row, header)) {
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
        ? ["PolicyNumber", "LoginId", "Password"]
        : [];

    conditional.forEach((header) => {
        if (!getTemplateString(row, header)) {
            errors.push(
                `Missing required field for PolicyContext=${row.PolicyContext}: ${header}`
            );
        }
    });

    errors.push(...validateEntryPointValue(row));

    const totalItems = getTemplateTotalItems(row);

    if (totalItems <= 0) {
        errors.push("TotalItems must be a positive integer");
    }

    if (totalItems > 20) {
        errors.push("TotalItems must not exceed 20");
    }

    return errors;
}
