// src/businessJourneys/journeys/athena/motor/newbusiness/runAthenaMotorNewbusiness.journey.ts

import { runJourneySteps } from "@businessJourneys/runner/runJourneySteps";
import type { BusinessJourney } from "@businessJourneys/shared/types";
import { buildAthenaMotorNewbusinessSteps } from "./buildAthenaMotorNewbusinessSteps";

export const runAthenaMotorNewbusinessJourney: BusinessJourney = {
    journeyKey: "athena.motor.newbusiness",
    matches: ({ application, product, journey }) =>
        application === "athena" &&
        product === "motor" &&
        journey === "newbusiness",

    run: async ({ context, route, data }) => {
        const steps = buildAthenaMotorNewbusinessSteps({
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
