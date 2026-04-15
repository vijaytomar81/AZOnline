// src/configLayer/routing/resolvers/resolveStartUrl.ts

import { AppError } from "@utils/errors";
import type { TargetEnvUrls } from "@configLayer/environments";
import type { RouteSelection } from "../types/routeSelection.types";
import type { RouteTarget } from "../types/route-target.types";
import { validateRouteSelection } from "../validators/validateRouteSelection";

export function resolveStartTarget(
    input: RouteSelection & { env: TargetEnvUrls }
): RouteTarget {
    const selection = validateRouteSelection(input);

    const url =
        input.env.startUrls[selection.platform]?.[selection.application]?.[selection.product];

    if (!url) {
        throw new AppError({
            code: "START_URL_MISSING",
            stage: "route-resolution",
            source: "resolveStartUrl",
            message: `No start URL configured for platform="${selection.platform}", application="${selection.application}", product="${selection.product}" in environment "${input.env.envName}".`,
            context: {
                environment: input.env.envName,
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

export function resolveStartUrl(
    input: RouteSelection & { env: TargetEnvUrls }
): string {
    return resolveStartTarget(input).url;
}
