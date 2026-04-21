// src/businessLayer/pageActions/actions/athena/azonline/common/loginOrRegistration.action.ts

import type { PageAction } from "@businessLayer/pageActions/shared";
import { logPageActionInfo } from "@businessLayer/pageActions/shared";

export const loginOrRegistrationAction: PageAction = async ({
    context,
    payload,
}) => {
    logPageActionInfo({
        scope: context.logScope,
        message: "loginOrRegistrationAction started.",
    });

    /*
     --------------------------------------------------------------------------- 
     TODO: review and enable click / radio / link interactions if needed:
     --------------------------------------------------------------------------- 
    
     await context.pages.common.loginOrRegistration.linkToAllianzHomePage();
    */

    logPageActionInfo({
        scope: context.logScope,
        message: "loginOrRegistrationAction completed.",
    });
};
