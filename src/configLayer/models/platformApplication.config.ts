// src/configLayer/models/platformApplication.config.ts

import {
    APPLICATIONS,
    type Application,
} from "./application.config";
import {
    PLATFORMS,
    type Platform,
} from "./platform.config";

export const ATHENA_APPLICATIONS = [
    APPLICATIONS.AZ_ONLINE,
    APPLICATIONS.FERRY,
    APPLICATIONS.BRITANNIA,
] as const satisfies readonly Application[];

export const PCW_APPLICATIONS = [
    APPLICATIONS.CTM,
    APPLICATIONS.CNF,
    APPLICATIONS.MSM,
    APPLICATIONS.GOCO,
] as const satisfies readonly Application[];

export const PCW_TOOL_APPLICATIONS = [
    APPLICATIONS.CTM,
    APPLICATIONS.CNF,
    APPLICATIONS.MSM,
    APPLICATIONS.GOCO,
] as const satisfies readonly Application[];

export const PLATFORM_APPLICATIONS: Record<Platform, readonly Application[]> = {
    [PLATFORMS.ATHENA]: ATHENA_APPLICATIONS,
    [PLATFORMS.PCW]: PCW_APPLICATIONS,
    [PLATFORMS.PCW_TOOL]: PCW_TOOL_APPLICATIONS,
};

export function getPlatformApplications(
    platform: Platform
): readonly Application[] {
    return PLATFORM_APPLICATIONS[platform];
}

export function isApplicationAllowedOnPlatform(args: {
    platform: Platform;
    application: Application;
}): boolean {
    return PLATFORM_APPLICATIONS[args.platform].includes(args.application);
}
