// src/frameworkCore/executionLayer/mode/e2e/scenario/parse/parseScenarios.ts

import { AppError } from "@utils/errors";
import type { Platform } from "@configLayer/models/platform.config";
import type { Application } from "@configLayer/models/application.config";
import type { Product } from "@configLayer/models/product.config";
import type { ExecutionScenario } from "@frameworkCore/executionLayer/contracts";
import type {
    RawExecutionScenarioRow,
    ScenarioValidationResult,
} from "../types";
import { normalizeScenarioList } from "../normalize";
import { validateScenarioList } from "../validate";
import { validateScenarioTemplates } from "../template";
import { filterDisabledScenarios } from "./filterDisabledScenarios";
import { formatValidationErrors } from "./formatValidationErrors";
import { hasValidationErrors } from "./hasValidationErrors";

export type ParseScenariosResult = {
    scenarios: ExecutionScenario[];
    templateValidation: ScenarioValidationResult[];
    validation: ScenarioValidationResult[];
};

export type ParseScenariosOptions = {
    includeDisabled?: boolean;
    failOnTemplateErrors?: boolean;
    failOnValidationErrors?: boolean;
    platform?: Platform;
    application?: Application;
    product?: Product;
};

export function parseScenarios(
    rows: RawExecutionScenarioRow[],
    opts: ParseScenariosOptions = {}
): ParseScenariosResult {
    const templateValidation = validateScenarioTemplates(rows);

    if (opts.failOnTemplateErrors && hasValidationErrors(templateValidation)) {
        throw new AppError({
            code: "SCENARIO_TEMPLATE_VALIDATION_FAILED",
            stage: "scenario-parsing",
            source: "parseScenarios",
            message: formatValidationErrors(
                "E2E scenario template validation failed",
                templateValidation
            ),
            context: {
                errorCount: templateValidation.length,
            },
        });
    }

    const normalized = normalizeScenarioList(rows, {
        platform: opts.platform,
        application: opts.application,
        product: opts.product,
    });

    const scenarios = filterDisabledScenarios(
        normalized,
        !!opts.includeDisabled
    );
    const validation = validateScenarioList(scenarios);

    if (opts.failOnValidationErrors && hasValidationErrors(validation)) {
        throw new AppError({
            code: "SCENARIO_VALIDATION_FAILED",
            stage: "scenario-parsing",
            source: "parseScenarios",
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
