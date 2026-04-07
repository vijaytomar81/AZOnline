// src/businessJourneys/journeys/goco/motor/newBusiness/runGocoMotorNewBusiness.journey.ts

import { runJourneySteps } from "@businessJourneys/runner/runJourneySteps";
import type { BusinessJourney } from "@businessJourneys/shared/types";
import { buildGocoMotorNewBusinessSteps } from "./buildGocoMotorNewBusinessSteps";

export const runGocoMotorNewBusinessJourney: BusinessJourney = {
    journeyKey: "goco.motor.newBusiness",
    matches: ({ application, product, journey }) =>
        application === "goco" &&
        product === "motor" &&
        journey === "newBusiness",

    run: async ({ context, route, data }) => {
        const steps = buildGocoMotorNewBusinessSteps({
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
