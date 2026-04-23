// src/businessLayer/businessJourneys/Athena/AzOnline/Motor/NewBusiness/runNewBusinessJourney.ts

import { pageActionsRegistry } from "@businessLayer/pageActions";
import {
    runJourney,
    type BusinessJourney,
} from "@businessLayer/businessJourneys/framework";

export const runNewBusinessJourney: BusinessJourney = async ({
    context,
    payload,
}) => {
    await runJourney({
        steps: [
        async () => {
            await pageActionsRegistry.athena.azonline.common.insuranceTypeSelection({
                context: context.pageActionContext,
                payload,
            });
        },
        async () => {
            await pageActionsRegistry.athena.azonline.common.loginOrRegistration({
                context: context.pageActionContext,
                payload,
            });
        },
        async () => {
            await pageActionsRegistry.athena.azonline.common.manageCookies({
                context: context.pageActionContext,
                payload,
            });
        },
        async () => {
            await pageActionsRegistry.athena.azonline.motor.carDetails({
                context: context.pageActionContext,
                payload,
            });
        },
        async () => {
            await pageActionsRegistry.athena.azonline.motor.phDrivingLicenceDetails({
                context: context.pageActionContext,
                payload,
            });
        },
        ],
    });
};
