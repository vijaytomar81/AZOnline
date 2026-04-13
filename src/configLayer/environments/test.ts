// src/configLayer/environments/test.ts

import type { TargetEnvUrls } from "./types";
import { ENV_NAMES } from "./envNames";
import { PLATFORMS } from "../models/platform.config";
import { APPLICATIONS } from "../models/application.config";
import { PRODUCTS } from "../models/product.config";

export const testEnv: TargetEnvUrls = {
    envName: ENV_NAMES.TEST,
    startUrls: {
        [PLATFORMS.ATHENA]: {
            [APPLICATIONS.AZ_ONLINE]: {
                [PRODUCTS.MOTOR]:
                    "https://customer-portal-lv-test.athenapaas.com",
                [PRODUCTS.HOME]: "REPLACE_ME",
            },
            [APPLICATIONS.FERRY]: {
                [PRODUCTS.MOTOR]: "REPLACE_ME",
                [PRODUCTS.HOME]: "REPLACE_ME",
            },
            [APPLICATIONS.BRITANNIA]: {
                [PRODUCTS.MOTOR]: "REPLACE_ME",
                [PRODUCTS.HOME]: "REPLACE_ME",
            },
        },

        [PLATFORMS.PCW_TOOL]: {
            [APPLICATIONS.CTM]: {
                [PRODUCTS.MOTOR]: "https://aggregator-test-portal-lv-test.athenapaas.com",
                [PRODUCTS.HOME]: "https://aggregator-test-portal-lv-test.athenapaas.com",
            },
            [APPLICATIONS.CNF]: {
                [PRODUCTS.MOTOR]: "https://aggregator-test-portal-lv-test.athenapaas.com",
                [PRODUCTS.HOME]: "https://aggregator-test-portal-lv-test.athenapaas.com",
            },
            [APPLICATIONS.MSM]: {
                [PRODUCTS.MOTOR]: "https://aggregator-test-portal-lv-test.athenapaas.com",
                [PRODUCTS.HOME]: "https://aggregator-test-portal-lv-test.athenapaas.com",
            },
            [APPLICATIONS.GOCO]: {
                [PRODUCTS.MOTOR]: "https://aggregator-test-portal-lv-test.athenapaas.com",
                [PRODUCTS.HOME]: "https://aggregator-test-portal-lv-test.athenapaas.com",
            },
        },

        [PLATFORMS.PCW]: {
            [APPLICATIONS.CTM]: {
                [PRODUCTS.MOTOR]:
                    "https://journey-gateway-product.uat.ctmers.io/car/5.0/start",
                [PRODUCTS.HOME]:
                    "https://journey-gateway-product.uat.ctmers.io/home/4.0/start",
            },
            [APPLICATIONS.CNF]: {
                [PRODUCTS.MOTOR]:
                    "https://my.confusedpartnertest.co.uk",
                [PRODUCTS.HOME]: "REPLACE_ME",
            },
            [APPLICATIONS.MSM]: {
                [PRODUCTS.MOTOR]:
                    "https://pre.moneysupermarket.dev",
                [PRODUCTS.HOME]: "REPLACE_ME",
            },
            [APPLICATIONS.GOCO]: {
                [PRODUCTS.MOTOR]:
                    "https://www.partnertest-gocompare.com",
                [PRODUCTS.HOME]: "REPLACE_ME",
            },
        },
    },

    serviceUrls: {
        Athena: {
            [APPLICATIONS.AZ_ONLINE]: {
                supportPortalUrl:
                    "https://support-portal-lv-demo.athenapaas.com",
                backdatingToolUrl:
                    "https://backdating-tool-lv-test.athenapaas.com",
            },
            [APPLICATIONS.FERRY]: {
                supportPortalUrl: "REPLACE_ME",
                backdatingToolUrl: "REPLACE_ME",
            },
            [APPLICATIONS.BRITANNIA]: {
                supportPortalUrl: "REPLACE_ME",
                backdatingToolUrl: "REPLACE_ME",
            },
        },
    },
};
