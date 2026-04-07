// src/businessJourneyTools/business-journey-generator/generator/buildJourneyTargets.ts

import { JourneyTarget } from "./types";

const PRODUCTS = ["motor", "home"];
const JOURNEYS = ["newbusiness"];
const ENTRY_POINTS = ["direct", "pcw", "pcwtool"];

export function buildJourneyTargets(): JourneyTarget[] {
    const targets: JourneyTarget[] = [];

    for (const product of PRODUCTS) {
        for (const journey of JOURNEYS) {
            for (const entryPoint of ENTRY_POINTS) {
                targets.push({
                    application: "athena",
                    product,
                    journey,
                    entryPoint,
                });
            }
        }
    }

    return targets;
}
