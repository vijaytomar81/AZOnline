// src/frameworkCore/executionLayer/mode/e2e/scenario/template/validateTemplateHeaders.ts

import { AppError } from "@utils/errors";
import { missingHeaders } from "./missingHeaders";

export function validateTemplateHeaders(
    headers: string[]
): void {
    const requiredBaseHeaders = [
        "ScenarioId",
        "ScenarioName",
        "Platform",
        "Application",
        "Product",
        "JourneyStartWith",
        "Description",
        "Execute",
        "TotalItems",
    ];

    const requiredItem1Headers = [
        "Item1Action",
        "Item1SubType",
        "Item1Portal",
        "Item1TestCaseRef",
    ];

    const errors = [
        ...missingHeaders(headers, requiredBaseHeaders),
        ...missingHeaders(headers, requiredItem1Headers),
    ].map((header) => `Missing required header: ${header}`);

    if (!errors.length) {
        return;
    }

    throw new AppError({
        code: "SCENARIO_HEADER_VALIDATION_FAILED",
        stage: "load-scenario-sheet",
        source: "validateTemplateHeaders",
        message: `E2E scenario sheet header validation failed\n${errors.join("\n")}`,
        context: {
            errorCount: errors.length,
        },
    });
}
