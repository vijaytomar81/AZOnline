// src/configLayer/domain/partnerApplications.ts

export const PARTNER_APPLICATIONS = [
    "msm",
    "ctm",
    "cnf",
    "goco",
] as const;

export type PartnerApplication =
    typeof PARTNER_APPLICATIONS[number];
