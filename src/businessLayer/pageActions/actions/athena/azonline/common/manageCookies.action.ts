// src/businessLayer/pageActions/actions/athena/azonline/common/manageCookies.action.ts

import type { PageAction } from "@businessLayer/pageActions/shared";
import { logPageActionInfo } from "@businessLayer/pageActions/shared";

export const manageCookiesAction: PageAction = async ({
    context,
    payload,
}) => {
    logPageActionInfo({
        scope: context.logScope,
        message: "manageCookiesAction started.",
    });

    /*
     --------------------------------------------------------------------------- 
     TODO: review and enable click / radio / link interactions if needed:
     --------------------------------------------------------------------------- 
    
     await context.pages.common.manageCookies.buttonAcceptAll();
     await context.pages.common.manageCookies.buttonManageCookies();
     await context.pages.common.manageCookies.buttonRejectAll();
     await context.pages.common.manageCookies.linkReferToOurCookiePolicy();
    */

    logPageActionInfo({
        scope: context.logScope,
        message: "manageCookiesAction completed.",
    });
};
