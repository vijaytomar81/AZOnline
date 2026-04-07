// src/config/environments/types.ts

export type PcwPartner = "CTM" | "CNF" | "MSM" | "GOCO";
export type Product = "Motor" | "Home";
export type Application = "AzOnline" | "Ferry" | "Britannia";

export type EnvKey = "dev" | "test" | "demo" | "nft";

export type PartnerEntryUrls = {
    Motor: Partial<Record<PcwPartner, string>>;
    Home: Partial<Record<PcwPartner, string>>;
};

export type ApplicationUrls = {
    customerPortalUrl: string;
    supportPortalUrl?: string;
    pcwTestToolUrl: string;
    backdatingToolUrl: string;
    partnerEntryUrls: PartnerEntryUrls;
};

export type TargetEnvUrls = {
    applications: Record<Application, ApplicationUrls>;
};

export type EnvironmentsConfig = {
    defaultEnv: EnvKey;
    calculatedEmailBase: string;
    envs: Record<EnvKey, TargetEnvUrls>;
};
