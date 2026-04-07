// src/businessJourneyTools/business-journey-generator/generator/naming/buildStepFileName.ts

import { toCamelFromText } from "@utils/text";

function toPascal(value: string): string {
    const camel = toCamelFromText(value);
    return camel ? camel[0].toUpperCase() + camel.slice(1) : "";
}

export function buildStepFileName(stepName: string): string {
    return `step${toPascal(stepName)}.ts`;
}
