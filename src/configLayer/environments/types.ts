// src/configLayer/environments/types.ts

import type {
    AthenaApplication,
    PartnerApplication,
} from "../models/application.config";
import type { Product } from "../models/product.config";

export type ApplicationUrlKey =
    | "customerPortalUrl"
    | "supportPortalUrl"
    | "pcwTestToolUrl"
    | "backdatingToolUrl";

export type PartnerEntryUrls = Record<
    Product,
    Partial<Record<PartnerApplication, string>>
>;

export type ApplicationUrls = {
    customerPortalUrl: string;
    supportPortalUrl: string;
    pcwTestToolUrl: string;
    backdatingToolUrl: string;
    partnerEntryUrls: PartnerEntryUrls;
};

export type TargetEnvUrls = {
    applications: Record<AthenaApplication, ApplicationUrls>;
};

export type EnvKey = "dev" | "test" | "demo" | "nft";

export type EnvironmentsConfig = {
    defaultEnv: EnvKey;
    envs: Record<EnvKey, TargetEnvUrls>;
    calculatedEmailBase: string;
};
