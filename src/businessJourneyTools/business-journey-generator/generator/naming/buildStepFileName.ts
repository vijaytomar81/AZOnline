// src/businessJourneyTools/business-journey-generator/generator/naming/buildStepFileName.ts

function splitWords(value: string): string[] {
    return value
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[_\-.]+/g, " ")
        .trim()
        .split(/\s+/)
        .filter(Boolean);
}

function toPascalCase(value: string): string {
    return splitWords(value)
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join("");
}

export function buildStepFileName(stepName: string): string {
    return `step${toPascalCase(stepName)}.ts`;
}
