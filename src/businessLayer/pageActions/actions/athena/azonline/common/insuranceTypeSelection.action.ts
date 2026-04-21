// src/businessLayer/pageActions/actions/athena/azonline/common/insuranceTypeSelection.action.ts

import type { PageAction } from "@businessLayer/pageActions/shared";
import { logPageActionInfo } from "@businessLayer/pageActions/shared";

export const insuranceTypeSelectionAction: PageAction = async ({
    context,
    payload,
}) => {
    logPageActionInfo({
        scope: context.logScope,
        message: "insuranceTypeSelectionAction started.",
    });

    /*
     --------------------------------------------------------------------------- 
     TODO: review and enable click / radio / link interactions if needed:
     --------------------------------------------------------------------------- 
    
     await context.pages.common.insuranceTypeSelection.buttonInputBack();
     await context.pages.common.insuranceTypeSelection.linkCarQuote();
     await context.pages.common.insuranceTypeSelection.linkHomeQuote();
     await context.pages.common.insuranceTypeSelection.linkInputBack();
     await context.pages.common.insuranceTypeSelection.linkLetUsKnow();
     await context.pages.common.insuranceTypeSelection.linkTermsAndConditionsApply();
     await context.pages.common.insuranceTypeSelection.linkToAllianzHomePage();
    */

    logPageActionInfo({
        scope: context.logScope,
        message: "insuranceTypeSelectionAction completed.",
    });
};
