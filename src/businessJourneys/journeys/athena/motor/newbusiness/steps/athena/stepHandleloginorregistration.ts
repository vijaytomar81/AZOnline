// src/businessJourneys/journeys/athena/motor/newbusiness/steps/athena/stepHandleloginorregistration.ts

import type { JourneyStep } from "@businessJourneys/shared/types";
import { handleLoginOrRegistrationAction } from "@pageActions";

export const stepHandleloginorregistration: JourneyStep = {
    stepKey: "handleloginorregistration",
    run: async ({ context, data }) => {
        await handleLoginOrRegistrationAction({
            context: context.pageActionContext,
            payload: data,
        });

        // TODO: refine payload source path if needed
        void data;
    },
};
