// src/configLayer/resolvers/resolveStartUrl.ts

import { AppError } from "@utils/errors";
import type { Application, Product } from "@configLayer/environments";
import type { RouteDescriptor } from "../domain/routing.config";
import { resolveApplicationUrl } from "./resolveApplicationUrl";
import { resolvePcwUrl } from "./resolvePcwUrl";
import type { RouteTarget } from "../types/route-target.types";

function requireApplication(
    application: RouteDescriptor["application"]
): Application {
    if (application) {
        return application as Application;
    }

    throw new AppError({
        code: "ROUTE_APPLICATION_MISSING",
        stage: "route-resolution",
        source: "resolveStartUrl",
        message: "Application is required to resolve the start URL.",
    });
}

function requireProduct(product: RouteDescriptor["product"]): Product {
    if (product) {
        return product as Product;
    }

    throw new AppError({
        code: "ROUTE_PRODUCT_MISSING",
        stage: "route-resolution",
        source: "resolveStartUrl",
        message: "Product is required to resolve the start URL.",
    });
}

export function resolveStartTarget(input: RouteDescriptor): RouteTarget {
    const application = requireApplication(input.application);
    const entryPoint = input.entryPoint ?? "Direct";

    if (entryPoint === "Direct") {
        return {
            kind: "Direct",
            url: resolveApplicationUrl({
                application,
                key: "customerPortalUrl",
            }),
        };
    }

    if (entryPoint === "PCWTool") {
        return {
            kind: "PCWTool",
            url: resolveApplicationUrl({
                application,
                key: "pcwTestToolUrl",
            }),
        };
    }

    if (entryPoint === "PCW") {
        return {
            kind: "PCW",
            url: resolvePcwUrl({
                application,
                product: requireProduct(input.product),
                journey: input.journey,
            }),
        };
    }

    throw new AppError({
        code: "ENTRY_POINT_UNSUPPORTED",
        stage: "route-resolution",
        source: "resolveStartTarget",
        message: `Unsupported entry point "${String(entryPoint)}".`,
        context: {
            application,
            product: input.product,
            journey: input.journey,
            entryPoint,
        },
    });
}

export function resolveStartUrl(input: RouteDescriptor): string {
    return resolveStartTarget(input).url;
}
