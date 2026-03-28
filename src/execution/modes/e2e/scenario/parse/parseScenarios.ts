// src/execution/modes/e2e/scenario/parse/parseScenarios.ts

import { AppError } from "@utils/errors";
import type { RawScenarioRow } from "../types";
import type { ParseScenariosOptions, ParseScenariosResult } from "./types";
import { filterDisabledScenarios } from "./filterDisabledScenarios";
import { formatValidationErrors } from "./formatValidationErrors";
import { hasValidationErrors } from "./hasValidationErrors";
import { normalizeScenarioList } from "../normalize/normalizeScenarioList";
import { validateScenarioList } from "../validate/validateScenarioList";
import { validateTemplateRows } from "../template/validateTemplateRows";

export function parseScenarios(
    rows: RawScenarioRow[],
    opts: ParseScenariosOptions = {}
): ParseScenariosResult {
    const templateValidation = validateTemplateRows(rows);

    if (opts.failOnTemplateErrors && hasValidationErrors(templateValidation)) {
        throw new AppError({
            code: "SCENARIO_TEMPLATE_VALIDATION_FAILED",
            stage: "scenario-parsing",
            source: "parser",
            message: formatValidationErrors(
                "E2E pipeline template validation failed",
                templateValidation
            ),
            context: {
                errorCount: templateValidation.length,
            },
        });
    }

    const normalized = normalizeScenarioList(rows);
    const scenarios = filterDisabledScenarios(normalized, !!opts.includeDisabled);
    const validation = validateScenarioList(scenarios);

    if (opts.failOnValidationErrors && hasValidationErrors(validation)) {
        throw new AppError({
            code: "SCENARIO_VALIDATION_FAILED",
            stage: "scenario-parsing",
            source: "parser",
            message: formatValidationErrors(
                "Scenario validation failed",
                validation
            ),
            context: {
                errorCount: validation.length,
            },
        });
    }

    return {
        scenarios,
        templateValidation,
        validation,
    };
}
