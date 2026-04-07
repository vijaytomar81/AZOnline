// src/pageActions/actions/athena/common/handleLoginOrRegistration.action.ts

import type { PageAction } from "@businessLayer/pageActions/shared";
import { logPageActionInfo } from "@businessLayer/pageActions/shared";

export const handleLoginOrRegistrationAction: PageAction = async ({
    context,
    payload,
}) => {
    logPageActionInfo({
        scope: context.logScope,
        message: "handleLoginOrRegistrationAction started.",
    });

    /*
     --------------------------------------------------------------------------- 
     TODO: review and enable click / radio / link interactions if needed:
     --------------------------------------------------------------------------- 
    
         await context.pages.athena.loginOrRegistration.linkToAllianzHomePage();

    */

    logPageActionInfo({
        scope: context.logScope,
        message: "handleLoginOrRegistrationAction completed.",
    });
};
