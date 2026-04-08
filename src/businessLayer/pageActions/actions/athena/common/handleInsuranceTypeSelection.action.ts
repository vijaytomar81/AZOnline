// src/businessLayer/pageActions/actions/athena/common/handleInsuranceTypeSelection.action.ts

import type { PageAction } from "@businessLayer/pageActions/shared";
import { logPageActionInfo } from "@businessLayer/pageActions/shared";

export const handleInsuranceTypeSelectionAction: PageAction = async ({
    context,
    payload,
}) => {
    logPageActionInfo({
        scope: context.logScope,
        message: "handleInsuranceTypeSelectionAction started.",
    });

    /*
     --------------------------------------------------------------------------- 
     TODO: review and enable click / radio / link interactions if needed:
     --------------------------------------------------------------------------- 
    
         await context.pages.athena.insuranceTypeSelection.buttonInputBack();

         await context.pages.athena.insuranceTypeSelection.linkCarQuote();

         await context.pages.athena.insuranceTypeSelection.linkHomeQuote();

         await context.pages.athena.insuranceTypeSelection.linkInputBack();

         await context.pages.athena.insuranceTypeSelection.linkLetUsKnow();

         await context.pages.athena.insuranceTypeSelection.linkTermsAndConditionsApply();

         await context.pages.athena.insuranceTypeSelection.linkToAllianzHomePage();

    */

    logPageActionInfo({
        scope: context.logScope,
        message: "handleInsuranceTypeSelectionAction completed.",
    });
};
