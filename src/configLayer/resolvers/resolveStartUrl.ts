// src/configLayer/resolvers/resolveStartUrl.ts

import { AppError } from "@utils/errors";
import { envConfig } from "@configLayer/env";
import type { RouteSelection } from "../types/routeSelection.types";
import type { RouteTarget } from "../types/route-target.types";
import { validateRouteSelection } from "../validators/validateRouteSelection";

export function resolveStartTarget(input: RouteSelection): RouteTarget {
    const selection = validateRouteSelection(input);

    const url =
        envConfig.env.startUrls[selection.platform]?.[selection.application]?.[selection.product];

    if (!url) {
        throw new AppError({
            code: "START_URL_MISSING",
            stage: "route-resolution",
            source: "resolveStartUrl",
            message: `No start URL configured for platform="${selection.platform}", application="${selection.application}", product="${selection.product}" in environment "${envConfig.name}".`,
            context: {
                environment: envConfig.name,
                platform: selection.platform,
                application: selection.application,
                product: selection.product,
                journeyContext: selection.journeyContext,
            },
        });
    }

    return {
        platform: selection.platform,
        url,
    };
}

export function resolveStartUrl(input: RouteSelection): string {
    return resolveStartTarget(input).url;
}
