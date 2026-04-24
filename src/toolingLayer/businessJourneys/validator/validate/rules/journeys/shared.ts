// src/toolingLayer/businessJourneys/validator/validate/rules/journeys/shared.ts

import fs from "node:fs";
import path from "node:path";
import { BUSINESS_JOURNEYS_DIR } from "@utils/paths";
import { buildJourneyTargets } from "@toolingLayer/businessJourneys/generator/generator/buildJourneyTargets";
import { loadJourneyGenerationInputs } from "@toolingLayer/businessJourneys/generator/generator/loadJourneyGenerationInputs";
import type { JourneyTarget } from "@toolingLayer/businessJourneys/generator/generator/types";

export function buildTargetSegments(target: JourneyTarget): string[] {
    return [
        String(target.platform),
        String(target.application),
        String(target.product),
        String(target.journeyType),
    ];
}

export function buildJourneyDir(target: JourneyTarget): string {
    return path.join(BUSINESS_JOURNEYS_DIR, ...buildTargetSegments(target));
}

export function buildJourneyIndexFile(target: JourneyTarget): string {
    return path.join(buildJourneyDir(target), "index.ts");
}

export function buildJourneyRunnerFile(target: JourneyTarget): string {
    return path.join(
        buildJourneyDir(target),
        `run${String(target.journeyType)}Journey.ts`
    );
}

export function buildJourneyExportName(target: JourneyTarget): string {
    return `run${String(target.journeyType)}Journey`;
}

export function loadExpectedJourneyTargets(): JourneyTarget[] {
    return buildJourneyTargets(loadJourneyGenerationInputs());
}

export function walkJourneyRunnerFiles(dir = BUSINESS_JOURNEYS_DIR): string[] {
    if (!fs.existsSync(dir)) {
        return [];
    }

    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            return walkJourneyRunnerFiles(fullPath);
        }

        return entry.isFile() && /^run[A-Z].*Journey\.ts$/.test(entry.name)
            ? [fullPath]
            : [];
    });
}
