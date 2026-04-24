// src/toolingLayer/businessJourneys/generator/generator/journey/journeyNaming.ts

import {
    JOURNEY_TYPES,
    type JourneyContext,
} from "@configLayer/models/journeyContext.config";

function toPascalCase(value: string): string {
    return value
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[_\-.]+/g, " ")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join("");
}

export function buildJourneyFolderSegments(
    context: JourneyContext
): string[] {
    if (context.type === JOURNEY_TYPES.MTA) {
        return [
            context.type,
            context.subType,
        ];
    }

    return [context.type];
}

export function buildJourneyExportName(
    context: JourneyContext
): string {
    if (context.type === JOURNEY_TYPES.MTA) {
        return `run${toPascalCase(context.subType)}MtaJourney`;
    }

    return `run${toPascalCase(context.type)}Journey`;
}

export function buildJourneyRunnerFileName(
    context: JourneyContext
): string {
    return `${buildJourneyExportName(context)}.ts`;
}
