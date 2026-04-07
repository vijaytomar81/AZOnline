// src/businessJourneys/journeys/cnf/motor/newBusiness/steps/athena/stepHandleInsuranceTypeSelection.ts

import type { JourneyStep } from "@businessJourneys/shared/types";
import { handleInsuranceTypeSelectionAction } from "@pageActions";

export const stepHandleInsuranceTypeSelection: JourneyStep = {
    stepKey: "handleInsuranceTypeSelection",
    run: async ({ context, data }) => {
        await handleInsuranceTypeSelectionAction({
            context: context.pageActionContext,
            payload: data,
        });

        // TODO: refine payload source path if needed
        void data;
    },
};
