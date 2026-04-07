// src/businessJourneys/journeys/athena/home/newbusiness/runAthenaHomeNewbusiness.journey.ts

import { runJourneySteps } from "@businessJourneys/runner/runJourneySteps";
import type { BusinessJourney } from "@businessJourneys/shared/types";
import { buildAthenaHomeNewbusinessSteps } from "./buildAthenaHomeNewbusinessSteps";

export const runAthenaHomeNewbusinessJourney: BusinessJourney = {
    journeyKey: "athena.home.newbusiness",
    matches: ({ application, product, journey }) =>
        application === "athena" &&
        product === "home" &&
        journey === "newbusiness",

    run: async ({ context, route, data }) => {
        const steps = buildAthenaHomeNewbusinessSteps({
            entryPoint: route.entryPoint,
        });

        await runJourneySteps({
            context,
            route,
            data,
            steps,
        });
    },
};
