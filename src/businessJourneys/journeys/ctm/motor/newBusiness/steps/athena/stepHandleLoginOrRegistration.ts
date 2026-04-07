// src/businessJourneys/journeys/ctm/motor/newBusiness/steps/athena/stepHandleLoginOrRegistration.ts

import type { JourneyStep } from "@businessJourneys/shared/types";
import { handleLoginOrRegistrationAction } from "@pageActions";

export const stepHandleLoginOrRegistration: JourneyStep = {
    stepKey: "handleLoginOrRegistration",
    run: async ({ context, data }) => {
        await handleLoginOrRegistrationAction({
            context: context.pageActionContext,
            payload: data,
        });

        // TODO: refine payload source path if needed
        void data;
    },
};
