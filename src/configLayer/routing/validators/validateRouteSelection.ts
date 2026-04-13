// src/configLayer/routing/validators/validateRouteSelection.ts

import { AppError } from "@utils/errors";
import type { RouteSelection } from "../types/routeSelection.types";
import { PLATFORM_APPLICATIONS } from "../../models/platformApplication.config";

export function isValidRouteSelection(
    selection: RouteSelection
): boolean {
    const validApplications = PLATFORM_APPLICATIONS[selection.platform] ?? [];
    return validApplications.includes(selection.application);
}

export function validateRouteSelection(
    selection: RouteSelection
): RouteSelection {
    if (isValidRouteSelection(selection)) {
        return selection;
    }

    throw new AppError({
        code: "INVALID_ROUTE_SELECTION",
        stage: "config-validation",
        source: "validateRouteSelection",
        message: `Invalid route selection: platform="${selection.platform}", application="${selection.application}", product="${selection.product}".`,
        context: {
            platform: selection.platform,
            application: selection.application,
            product: selection.product,
            journeyContext: selection.journeyContext,
            validApplicationsForPlatform:
                PLATFORM_APPLICATIONS[selection.platform] ?? [],
        },
    });
}
