// src/pageActions/actions/athena/common/handleManageCookies.action.ts

import type { PageAction } from "@pageActions/shared";
import { logPageActionInfo } from "@pageActions/shared";

export const handleManageCookiesAction: PageAction = async ({
    context,
    payload,
}) => {
    logPageActionInfo({
        scope: context.logScope,
        message: "handleManageCookiesAction started.",
    });

    /*
     --------------------------------------------------------------------------- 
     TODO: review and enable click / radio / link interactions if needed:
     --------------------------------------------------------------------------- 
    
         await context.pages.athena.manageCookies.buttonAcceptAll();

         await context.pages.athena.manageCookies.buttonManageCookies();

         await context.pages.athena.manageCookies.buttonRejectAll();

         await context.pages.athena.manageCookies.linkReferToOurCookiePolicy();

    */

    logPageActionInfo({
        scope: context.logScope,
        message: "handleManageCookiesAction completed.",
    });
};
