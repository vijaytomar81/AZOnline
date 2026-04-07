// src/businessJourneys/journeys/athena/motor/newBusiness/runAthenaMotorNewBusiness.journey.ts

import { runJourneySteps } from "@businessJourneys/runner/runJourneySteps";
import type { BusinessJourney } from "@businessJourneys/shared/types";
import { buildAthenaMotorNewBusinessSteps } from "./buildAthenaMotorNewBusinessSteps";

export const runAthenaMotorNewBusinessJourney: BusinessJourney = {
    journeyKey: "athena.motor.newBusiness",
    matches: ({ application, product, journey }) =>
        application === "athena" &&
        product === "motor" &&
        journey === "newBusiness",

    run: async ({ context, route, data }) => {
        const steps = buildAthenaMotorNewBusinessSteps({
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
