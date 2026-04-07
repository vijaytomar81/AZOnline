// src/businessJourneys/journeys/athena/motor/newBusiness/steps/athena/stepFillPhDrivingLicenceDetails.ts

import type { JourneyStep } from "@businessJourneys/shared/types";
import { fillPhDrivingLicenceDetailsAction } from "@pageActions";

export const stepFillPhDrivingLicenceDetails: JourneyStep = {
    stepKey: "fillPhDrivingLicenceDetails",
    run: async ({ context, data }) => {
        await fillPhDrivingLicenceDetailsAction({
            context: context.pageActionContext,
            payload: data,
        });

        // TODO: refine payload source path if needed
        void data;
    },
};
