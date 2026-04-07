// src/businessJourneys/journeys/athena/motor/newbusiness/steps/athena/stepHandlemanagecookies.ts

import type { JourneyStep } from "@businessJourneys/shared/types";
import { handleManageCookiesAction } from "@pageActions";

export const stepHandlemanagecookies: JourneyStep = {
    stepKey: "handlemanagecookies",
    run: async ({ context, data }) => {
        await handleManageCookiesAction({
            context: context.pageActionContext,
            payload: data,
        });

        // TODO: refine payload source path if needed
        void data;
    },
};
