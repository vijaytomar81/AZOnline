// src/businessJourneys/journeys/cnf/motor/newBusiness/steps/athena/stepHandleManageCookies.ts

import type { JourneyStep } from "@businessJourneys/shared/types";
import { handleManageCookiesAction } from "@pageActions";

export const stepHandleManageCookies: JourneyStep = {
    stepKey: "handleManageCookies",
    run: async ({ context, data }) => {
        await handleManageCookiesAction({
            context: context.pageActionContext,
            payload: data,
        });

        // TODO: refine payload source path if needed
        void data;
    },
};
