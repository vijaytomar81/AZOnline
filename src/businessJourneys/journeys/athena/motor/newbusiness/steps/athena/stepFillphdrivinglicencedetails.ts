// src/businessJourneys/journeys/athena/motor/newbusiness/steps/athena/stepFillphdrivinglicencedetails.ts

import type { JourneyStep } from "@businessJourneys/shared/types";
import { fillPhDrivingLicenceDetailsAction } from "@pageActions";

export const stepFillphdrivinglicencedetails: JourneyStep = {
    stepKey: "fillphdrivinglicencedetails",
    run: async ({ context, data }) => {
        await fillPhDrivingLicenceDetailsAction({
            context: context.pageActionContext,
            payload: data,
        });

        // TODO: refine payload source path if needed
        void data;
    },
};
