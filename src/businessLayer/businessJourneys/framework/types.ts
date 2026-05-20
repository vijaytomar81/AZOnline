// src/businessLayer/businessJourneys/framework/types.ts

import type { ExecutionContext } from "@frameworkCore/executionLayer/contracts";
import type { PageActionContext } from "@businessLayer/pageActions/shared";

export type BusinessJourneyContext = {
    executionContext: ExecutionContext;
    pageActionContext: PageActionContext;
    logScope: string;
};

export type BusinessJourneyArgs<TPayload = Record<string, unknown>> = {
    context: BusinessJourneyContext;
    payload: TPayload;
};

export type BusinessJourney<TPayload = Record<string, unknown>> = (
    args: BusinessJourneyArgs<TPayload>
) => Promise<void>;
