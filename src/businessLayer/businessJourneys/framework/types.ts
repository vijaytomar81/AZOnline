// src/businessLayer/businessJourneys/framework/types.ts

import type { PageActionContext } from "@businessLayer/pageActions";

export type BusinessJourneyContext = {
    pageActionContext: PageActionContext;
    logScope: string;
};

export type BusinessJourneyArgs<TPayload = Record<string, unknown>> = {
    context: BusinessJourneyContext;
    payload?: TPayload;
};

export type BusinessJourney<TPayload = Record<string, unknown>> = (
    args: BusinessJourneyArgs<TPayload>
) => Promise<void>;
