// src/configLayer/models/application.config.ts

export const APPLICATIONS = {
    AZ_ONLINE: "AzOnline",
    FERRY: "Ferry",
    BRITANNIA: "Britannia",
    MSM: "MSM",
    CTM: "CTM",
    CNF: "CNF",
    GOCO: "GoCo",
} as const;

export type Application =
    (typeof APPLICATIONS)[keyof typeof APPLICATIONS];

export const ATHENA_APPLICATION_KEYS = {
    AZ_ONLINE: "AZ_ONLINE",
    FERRY: "FERRY",
    BRITANNIA: "BRITANNIA",
} as const;

export const PCW_APPLICATION_KEYS = {
    MSM: "MSM",
    CTM: "CTM",
    CNF: "CNF",
    GOCO: "GOCO",
} as const;
