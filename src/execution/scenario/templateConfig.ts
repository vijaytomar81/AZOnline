// src/execution/scenario/templateConfig.ts

export type ScenarioTemplateConfig = {
    requiredBaseHeaders: string[];
    conditionalBaseHeaders: {
        existingPolicy: string[];
        newBusiness: string[];
    };
    stepFieldSuffixes: string[];
    maxSteps: number;
};

export const defaultScenarioTemplateConfig: ScenarioTemplateConfig = {
    requiredBaseHeaders: [
        "ScenarioId",
        "ScenarioName",
        "Journey",
        "StartFrom",
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