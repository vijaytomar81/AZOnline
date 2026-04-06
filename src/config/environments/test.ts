// src/config/environments/test.ts

import type { TargetEnvUrls } from "./types";

export const testEnv: TargetEnvUrls = {
    applications: {
        AzOnline: {
            customerPortalUrl:
                "https://customer-portal-lv-test.athenapaas.com",
            supportPortalUrl:
                "https://support-portal-lv-demo.athenapaas.com",
            pcwTestToolUrl:
                "https://aggregator-test-portal-lv-test.athenapaas.com",
            backdatingToolUrl:
                "https://backdating-tool-lv-test.athenapaas.com",
            partnerEntryUrls: {
                Motor: {
                    CTM: "https://journey-gateway-product.uat.ctmers.io/car/5.0/start",
                    CNF: "https://my.confusedpartnertest.co.uk",
                    MSM: "https://pre.moneysupermarket.dev",
                    GOCO: "https://www.partnertest-gocompare.com",
                },
                Home: {
                    CTM: "https://journey-gateway-product.uat.ctmers.io/home/4.0/start",
                    CNF: "REPLACE_ME",
                    MSM: "REPLACE_ME",
                    GOCO: "REPLACE_ME",
                },
            },
        },

        Ferry: {
            customerPortalUrl: "REPLACE_ME",
            supportPortalUrl: "REPLACE_ME",
            pcwTestToolUrl: "REPLACE_ME",
            backdatingToolUrl: "REPLACE_ME",
            partnerEntryUrls: {
                Motor: {
                    CTM: "REPLACE_ME",
                    CNF: "REPLACE_ME",
                    MSM: "REPLACE_ME",
                    GOCO: "REPLACE_ME",
                },
                Home: {
                    CTM: "REPLACE_ME",
                    CNF: "REPLACE_ME",
                    MSM: "REPLACE_ME",
                    GOCO: "REPLACE_ME",
                },
            },
        },

        Britannia: {
            customerPortalUrl: "REPLACE_ME",
            supportPortalUrl: "REPLACE_ME",
            pcwTestToolUrl: "REPLACE_ME",
            backdatingToolUrl: "REPLACE_ME",
            partnerEntryUrls: {
                Motor: {
                    CTM: "REPLACE_ME",
                    CNF: "REPLACE_ME",
                    MSM: "REPLACE_ME",
                    GOCO: "REPLACE_ME",
                },
                Home: {
                    CTM: "REPLACE_ME",
                    CNF: "REPLACE_ME",
                    MSM: "REPLACE_ME",
                    GOCO: "REPLACE_ME",
                },
            },
        },
    },
};
