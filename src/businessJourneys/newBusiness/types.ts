// src/businessJourneys/newBusiness/types.ts

import type { ExecutionContext } from "@executionLayer/contracts";

export type NewBusinessOutputValues = {
    quoteNumber?: string;
    policyNumber?: string;
    premium?: string;
    paymentMode?: string;
    requestType?: string;
    calculatedEmail?: string;
    journey?: string;
    payload?: Record<string, unknown>;
};

export type CaptureBusinessOutputsArgs = {
    context: ExecutionContext;
    values: NewBusinessOutputValues;
};
