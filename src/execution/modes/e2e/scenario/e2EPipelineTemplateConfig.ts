// src/execution/modes/e2e/scenario/e2EPipelineTemplateConfig.ts

export type E2EPipelineTemplateConfig = {
    requiredBaseHeaders: string[];
    conditionalBaseHeaders: {
        existingPolicy: string[];
        newBusiness: string[];
    };
    stepFieldSuffixes: string[];
    maxSteps: number;
};

export const defaultE2EPipelineTemplateConfig: E2EPipelineTemplateConfig = {
    requiredBaseHeaders: [
        "ScenarioId",
        "ScenarioName",
        "Journey",
        "PolicyContext",
        "EntryPoint",
        "Description",
        "Execute",
        "TotalSteps",
    ],

    conditionalBaseHeaders: {
        existingPolicy: ["PolicyNumber", "LoginId", "Password"],
        newBusiness: [],
    },

    stepFieldSuffixes: [
        "Action",
        "SubType",
        "Portal",
        "TestCaseId",
    ],

    maxSteps: 20,
};