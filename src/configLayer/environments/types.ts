// src/configLayer/environments/types.ts

import type { Platform } from "../models/platform.config";
import type {
    Application,
    AthenaApplication,
} from "../models/application.config";
import type { Product } from "../models/product.config";
import type { EnvKey } from "./envNames";

export type StartUrls = Record<
    Platform,
    Partial<Record<Application, Partial<Record<Product, string>>>>
>;

export type AthenaServiceUrls = {
    supportPortalUrl: string;
    backdatingToolUrl: string;
};

export type ServiceUrls = {
    Athena: Partial<Record<AthenaApplication, AthenaServiceUrls>>;
};

export type TargetEnvUrls = {
    envName: EnvKey;
    startUrls: StartUrls;
    serviceUrls: ServiceUrls;
};

export type EnvironmentsConfig = {
    envs: Record<EnvKey, TargetEnvUrls>;
    calculatedEmailBase: string;
};