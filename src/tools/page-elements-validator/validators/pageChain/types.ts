// src/tools/page-elements-validator/validators/pageChain/types.ts

export type ValidationStepName =
    | "Page Map → Elements"
    | "Elements → Generated Aliases"
    | "Generated Aliases → Business Aliases"
    | "Business Aliases → Page Object"
    | "Page Object Structure";

export type ValidationStepStatus = "OK" | "WARN" | "FAIL";

export type ValidationStepResult = {
    step: ValidationStepName;
    status: ValidationStepStatus;
    summary: string;
    messages: string[];
};

export type ValidateResult = {
    ok: boolean;
    errors: string[];
    warnings: string[];
    steps: ValidationStepResult[];
};

export function buildStep(
    step: ValidationStepName,
    errors: string[],
    warnings: string[],
    okSummary: string
): ValidationStepResult {

    if (errors.length) {
        return {
            step,
            status: "FAIL",
            summary: errors[0],
            messages: errors
        };
    }

    if (warnings.length) {
        return {
            step,
            status: "WARN",
            summary: warnings[0],
            messages: warnings
        };
    }

    return {
        step,
        status: "OK",
        summary: okSummary,
        messages: []
    };
}