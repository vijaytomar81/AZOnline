// src/configLayer/models/application.config.ts

export const APPLICATIONS = {
    AZ_ONLINE: "AzOnline",
    FERRY: "Ferry",
    BRITANNIA: "Britannia",
    MSM: "MSM",
    CTM: "CTM",
    CNF: "CNF",
    GOCO: "GOCO",
} as const;

export type Application =
    (typeof APPLICATIONS)[keyof typeof APPLICATIONS];

export type AthenaApplication =
    | typeof APPLICATIONS.AZ_ONLINE
    | typeof APPLICATIONS.FERRY
    | typeof APPLICATIONS.BRITANNIA;

export type PartnerApplication =
    | typeof APPLICATIONS.MSM
    | typeof APPLICATIONS.CTM
    | typeof APPLICATIONS.CNF
    | typeof APPLICATIONS.GOCO;

export function isAthenaApplication(
    application: Application
): application is AthenaApplication {
    return (
        application === APPLICATIONS.AZ_ONLINE ||
        application === APPLICATIONS.FERRY ||
        application === APPLICATIONS.BRITANNIA
    );
}

export function isPartnerApplication(
    application: Application
): application is PartnerApplication {
    return (
        application === APPLICATIONS.MSM ||
        application === APPLICATIONS.CTM ||
        application === APPLICATIONS.CNF ||
        application === APPLICATIONS.GOCO
    );
}
