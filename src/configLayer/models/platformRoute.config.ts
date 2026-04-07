// src/configLayer/models/platformRoute.config.ts

import { PLATFORMS, type Platform } from "./platform.config";

export type PlatformUrlResolutionMode =
    | "applicationUrl"
    | "partnerEntryUrl";

export const PLATFORM_ROUTE_CONFIG = {
    [PLATFORMS.ATHENA]: {
        urlResolutionMode: "applicationUrl",
        applicationUrlKey: "customerPortalUrl",
        requiresProduct: false,
    },
    [PLATFORMS.PCW_TOOL]: {
        urlResolutionMode: "applicationUrl",
        applicationUrlKey: "pcwTestToolUrl",
        requiresProduct: false,
    },
    [PLATFORMS.PCW]: {
        urlResolutionMode: "partnerEntryUrl",
        requiresProduct: true,
    },
} as const;

export type PlatformRouteConfig =
    (typeof PLATFORM_ROUTE_CONFIG)[Platform];

export function getPlatformRouteConfig(
    platform: Platform
): PlatformRouteConfig {
    return PLATFORM_ROUTE_CONFIG[platform];
}
