// src/toolingLayer/businessJourneys/generator/generator/mapActionToStep.ts

import { JOURNEY_STEP_FOLDERS, type JourneyStepFolder } from "@configLayer/domain/journeyStepFolders";
import type { PageActionEntry, StepMapping } from "./types";
import { buildStepExportName } from "./naming/buildStepExportName";
import { buildStepFileName } from "./naming/buildStepFileName";

function stripActionSuffix(actionName: string): string {
    return actionName.endsWith("Action")
        ? actionName.slice(0, -"Action".length)
        : actionName;
}

function lowerFirst(value: string): string {
    return value ? value[0].toLowerCase() + value.slice(1) : value;
}

function buildStepName(entry: PageActionEntry): string {
    return lowerFirst(stripActionSuffix(entry.actionName));
}

function buildStepFolder(entry: PageActionEntry): JourneyStepFolder {
    return entry.pageKey.startsWith("athena.")
        ? JOURNEY_STEP_FOLDERS.ATHENA
        : JOURNEY_STEP_FOLDERS.PARTNER;
}

export function mapActionToStep(entry: PageActionEntry): StepMapping {
    const stepName = buildStepName(entry);

    return {
        stepName,
        stepFileName: buildStepFileName(stepName),
        stepExportName: buildStepExportName(stepName),
        stepFolder: buildStepFolder(entry),
        actionImportName: entry.actionName,
        actionImportSource: "@pageActions",
        payloadExpression: "data",
    };
}