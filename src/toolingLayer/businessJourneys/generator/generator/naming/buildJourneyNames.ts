// src/tools/businessJourneys/generator/generator/naming/buildJourneyNames.ts

import type { JourneyTarget } from "../types";

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

export type JourneyNames = {
    journeyFolderName: string;
    applicationFolderName: string;
    productFolderName: string;
    runFileName: string;
    runExportName: string;
    buildStepsFileName: string;
    buildStepsExportName: string;
};

export function buildJourneyNames(target: JourneyTarget): JourneyNames {
    const app = toPascalCase(target.application);
    const product = toPascalCase(target.product);
    const journey = toPascalCase(target.journey);

    return {
        journeyFolderName: target.journey,
        applicationFolderName: target.application,
        productFolderName: target.product,
        runFileName: `run${app}${product}${journey}.journey.ts`,
        runExportName: `run${app}${product}${journey}Journey`,
        buildStepsFileName: `build${app}${product}${journey}Steps.ts`,
        buildStepsExportName: `build${app}${product}${journey}Steps`,
    };
}
