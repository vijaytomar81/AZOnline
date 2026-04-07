// src/businessJourneyTools/business-journey-generator/generator/mapActionToStep.ts

import { toCamelFromText } from "@utils/text";
import type { PageActionEntry, StepMapping } from "./types";
import { buildStepExportName } from "./naming/buildStepExportName";
import { buildStepFileName } from "./naming/buildStepFileName";

function stripActionSuffix(actionName: string): string {
    return actionName.endsWith("Action")
        ? actionName.slice(0, -"Action".length)
        : actionName;
}

function buildStepName(entry: PageActionEntry): string {
    const base = stripActionSuffix(entry.actionName);
    return toCamelFromText(base) || base;
}

function buildStepFolder(entry: PageActionEntry): "athena" | "partner" {
    return entry.pageKey.startsWith("athena.") ? "athena" : "partner";
}

function buildPayloadExpression(entry: PageActionEntry): string {
    if (entry.group === "common") {
        return "data";
    }

    return "data";
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
        payloadExpression: buildPayloadExpression(entry),
    };
}
