// src/configLayer/resolvers/resolveStartUrl.ts

import { AppError } from "@utils/errors";
import { envConfig } from "@configLayer/env";
import {
    APPLICATIONS,
    isAthenaApplication,
    isPartnerApplication,
    type Application,
} from "../models/application.config";
import type { Product } from "../models/product.config";
import { getPlatformRouteConfig } from "../models/platformRoute.config";
import type { RouteSelection } from "../types/routeSelection.types";
import type { RouteTarget } from "../types/route-target.types";
import { validateRouteSelection } from "../validators/validateRouteSelection";

type ApplicationUrlKey =
    | "customerPortalUrl"
    | "supportPortalUrl"
    | "pcwTestToolUrl"
    | "backdatingToolUrl";

function requireApplication(
    application: RouteSelection["application"]
): Application {
    if (application) {
        return application;
    }

    throw new AppError({
        code: "ROUTE_APPLICATION_MISSING",
        stage: "route-resolution",
        source: "resolveStartUrl",
        message: "Application is required to resolve the start URL.",
    });
}

function requireProduct(product: RouteSelection["product"]): Product {
    if (product) {
        return product;
    }

    throw new AppError({
        code: "ROUTE_PRODUCT_MISSING",
        stage: "route-resolution",
        source: "resolveStartUrl",
        message: "Product is required to resolve the start URL.",
    });
}

function resolveHostedApplicationUrl(args: {
    application: Application;
    key: ApplicationUrlKey;
}): string {
    if (!isAthenaApplication(args.application)) {
        throw new AppError({
            code: "ATHENA_APPLICATION_REQUIRED",
            stage: "route-resolution",
            source: "resolveStartUrl",
            message: `Application "${args.application}" is not a hosted Athena application.`,
            context: args,
        });
    }

    const appUrls = envConfig.env.applications[args.application];
    const url = appUrls?.[args.key];

    if (url) {
        return url;
    }

    throw new AppError({
        code: "APPLICATION_URL_MISSING",
        stage: "route-resolution",
        source: "resolveStartUrl",
        message: `URL "${args.key}" is missing for application "${args.application}" in environment "${envConfig.name}".`,
        context: {
            environment: envConfig.name,
            application: args.application,
            key: args.key,
        },
    });
}

function resolvePartnerEntryUrl(args: {
    application: Application;
    product: Product;
}): string {
    if (!isPartnerApplication(args.application)) {
        throw new AppError({
            code: "PARTNER_APPLICATION_REQUIRED",
            stage: "route-resolution",
            source: "resolveStartUrl",
            message: `Application "${args.application}" is not a partner application.`,
            context: args,
        });
    }

    const hostedApplication = APPLICATIONS.AZ_ONLINE;
    const appUrls = envConfig.env.applications[hostedApplication];
    const url = appUrls?.partnerEntryUrls?.[args.product]?.[args.application];

    if (url) {
        return url;
    }

    throw new AppError({
        code: "PARTNER_ENTRY_URL_MISSING",
        stage: "route-resolution",
        source: "resolveStartUrl",
        message: `No partner entry URL configured for application="${args.application}", product="${args.product}" in environment "${envConfig.name}".`,
        context: {
            environment: envConfig.name,
            hostedApplication,
            application: args.application,
            product: args.product,
        },
    });
}

export function resolveStartTarget(input: RouteSelection): RouteTarget {
    const selection = validateRouteSelection(input);
    const application = requireApplication(selection.application);
    const config = getPlatformRouteConfig(selection.platform);

    if (config.urlResolutionMode === "applicationUrl") {
        return {
            platform: selection.platform,
            url: resolveHostedApplicationUrl({
                application,
                key: config.applicationUrlKey,
            }),
        };
    }

    return {
        platform: selection.platform,
        url: resolvePartnerEntryUrl({
            application,
            product: requireProduct(selection.product),
        }),
    };
}

export function resolveStartUrl(input: RouteSelection): string {
    return resolveStartTarget(input).url;
}
