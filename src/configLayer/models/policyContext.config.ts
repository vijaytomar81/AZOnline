// src/config/models/policyContext.config.ts

export const POLICY_CONTEXTS = {
    NEW_BUSINESS: "NewBusiness",
    EXISTING_POLICY: "ExistingPolicy",
} as const;

export type PolicyContext =
    (typeof POLICY_CONTEXTS)[keyof typeof POLICY_CONTEXTS];
