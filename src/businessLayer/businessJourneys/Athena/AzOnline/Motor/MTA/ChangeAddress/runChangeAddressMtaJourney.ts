// src/businessLayer/businessJourneys/Athena/AzOnline/Motor/MTA/ChangeAddress/runChangeAddressMtaJourney.ts

import { pageActionsRegistry } from "@businessLayer/pageActions";
import {
    runJourney,
    type BusinessJourney,
} from "@businessLayer/businessJourneys/framework";

export const runChangeAddressMtaJourney: BusinessJourney = async ({
    context,
    payload,
}) => {
    const actions = pageActionsRegistry.athena.azonline;

    await runJourney({
        steps: [
            // TODO: QA to add MTA / ChangeAddress journey sequence.
            // Example:
            // async () => {
            //     await actions.common.insuranceTypeSelection({
            //         context: context.pageActionContext,
            //         payload,
            //     });
            // },
        ],
    });

    /*
     ---------------------------------------------------------------------------
     QA GUIDANCE
     ---------------------------------------------------------------------------
     This generated runner is intentionally a skeleton.

     PageActions are reusable and may apply to NewBusiness, Renewal, MTC, or MTA.
     The generator does not know the correct business sequence for this journey.

     QA should:
     - add only the pageActions required for this journey
     - order the steps according to the real user flow
     - keep route-specific conditions inside this runner
     - use pageActionsRegistry autocomplete via the "actions" variable

     Example available actions:
     // actions.common.insuranceTypeSelection
     // actions.common.loginOrRegistration

     To explore all available actions, type:
     actions.
    */

    void actions;
    void context;
    void payload;
};
