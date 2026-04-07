// src/businessJourneys/journeys/athena/home/newbusiness/steps/athena/stepHandleinsurancetypeselection.ts

import type { JourneyStep } from "@businessJourneys/shared/types";
import { handleInsuranceTypeSelectionAction } from "@pageActions";

export const stepHandleinsurancetypeselection: JourneyStep = {
    stepKey: "handleinsurancetypeselection",
    run: async ({ context, data }) => {
        await handleInsuranceTypeSelectionAction({
            context: context.pageActionContext,
            payload: data,
        });

        // TODO: refine payload source path if needed
        void data;
    },
};
