// src/businessJourneys/journeys/cnf/motor/newBusiness/runCnfMotorNewBusiness.journey.ts

import { runJourneySteps } from "@businessJourneys/runner/runJourneySteps";
import type { BusinessJourney } from "@businessJourneys/shared/types";
import { buildCnfMotorNewBusinessSteps } from "./buildCnfMotorNewBusinessSteps";

export const runCnfMotorNewBusinessJourney: BusinessJourney = {
    journeyKey: "cnf.motor.newBusiness",
    matches: ({ application, product, journey }) =>
        application === "cnf" &&
        product === "motor" &&
        journey === "newBusiness",

    run: async ({ context, route, data }) => {
        const steps = buildCnfMotorNewBusinessSteps({
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
