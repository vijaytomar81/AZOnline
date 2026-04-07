// src/businessJourneyTools/business-journey-generator/generator/naming/buildJourneyNames.ts

import { toCamelFromText } from "@utils/text";
import type { JourneyTarget } from "../types";

function toPascal(value: string): string {
    const camel = toCamelFromText(value);
    return camel ? camel[0].toUpperCase() + camel.slice(1) : "";
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
    const app = toPascal(target.application);
    const product = toPascal(target.product);
    const journey = toPascal(target.journey);

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
