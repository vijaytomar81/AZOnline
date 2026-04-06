// src/config/domain/application.inference.config.ts

import {
    APPLICATIONS,
    type Application,
} from "./routing.config";

export type ApplicationInferenceRule = {
    tokens: string[];
    application: Application;
};

export const APPLICATION_RAW_VALUE_MAP: Record<string, Application> = {
    azonline: APPLICATIONS.AZ_ONLINE,
    ferry: APPLICATIONS.FERRY,
    britannia: APPLICATIONS.BRITANNIA,
};

export const APPLICATION_SOURCE_RULES: ApplicationInferenceRule[] = [
    {
        tokens: ["azonline"],
        application: APPLICATIONS.AZ_ONLINE,
    },
    {
        tokens: ["ferry"],
        application: APPLICATIONS.FERRY,
    },
    {
        tokens: ["britannia"],
        application: APPLICATIONS.BRITANNIA,
    },
];
