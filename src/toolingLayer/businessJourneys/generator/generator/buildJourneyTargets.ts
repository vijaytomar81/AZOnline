// src/toolingLayer/businessJourneys/generator/generator/buildJourneyTargets.ts

import {
    APPLICATIONS,
    type Application,
} from "@configLayer/models/application.config";
import {
    JOURNEY_TYPES,
    type JourneyContext,
    type JourneyType,
} from "@configLayer/models/journeyContext.config";
import {
    isApplicationAllowedOnPlatform,
} from "@configLayer/models/platformApplication.config";
import {
    getPlatformJourneyTypes,
} from "@configLayer/models/platformJourney.config";
import {
    PLATFORMS,
    type Platform,
} from "@configLayer/models/platform.config";
import {
    PRODUCTS,
    type Product,
} from "@configLayer/models/product.config";
import {
    getProductMtaTypes,
} from "@configLayer/models/productMta.config";
import type {
    JourneyGenerationInputs,
    JourneyTarget,
} from "./types";

function normalize(value: string): string {
    return value.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

function resolvePlatform(value: string): Platform | null {
    return (
        Object.values(PLATFORMS).find(
            (item) => normalize(item) === normalize(value)
        ) ?? null
    );
}

function resolveApplication(value: string): Application | null {
    return (
        Object.values(APPLICATIONS).find(
            (item) => normalize(item) === normalize(value)
        ) ?? null
    );
}

function resolveProduct(value: string): Product | null {
    return (
        Object.values(PRODUCTS).find(
            (item) => normalize(item) === normalize(value)
        ) ?? null
    );
}

function buildJourneyContexts(args: {
    platform: Platform;
    product: Product;
}): JourneyContext[] {
    return getPlatformJourneyTypes(args.platform).flatMap(
        (journeyType: JourneyType) => {
            if (journeyType !== JOURNEY_TYPES.MTA) {
                return [
                    {
                        type: journeyType,
                    } as JourneyContext,
                ];
            }

            return getProductMtaTypes(args.product).map((subType) => ({
                type: JOURNEY_TYPES.MTA,
                subType,
            }));
        }
    );
}

function buildTargetKey(args: {
    platform: Platform;
    application: Application;
    product: Product;
    journeyContext: JourneyContext;
}): string {
    return [
        args.platform,
        args.application,
        args.product,
        args.journeyContext.type,
        "subType" in args.journeyContext
            ? args.journeyContext.subType
            : "",
    ].join("|");
}

export function buildJourneyTargets(
    inputs: JourneyGenerationInputs
): JourneyTarget[] {
    const routeKeys = new Set<string>();

    inputs.pageActions
        .filter((entry) => normalize(entry.scope.product) !== "common")
        .forEach((entry) => {
            const platform = resolvePlatform(entry.scope.platform);
            const application = resolveApplication(entry.scope.application);
            const product = resolveProduct(entry.scope.product);

            if (!platform || !application || !product) {
                return;
            }

            if (
                !isApplicationAllowedOnPlatform({
                    platform,
                    application,
                })
            ) {
                return;
            }

            routeKeys.add([platform, application, product].join("|"));
        });

    const targets = [...routeKeys].flatMap((key) => {
        const [platform, application, product] = key.split("|") as [
            Platform,
            Application,
            Product,
        ];

        return buildJourneyContexts({
            platform,
            product,
        }).map((journeyContext) => ({
            platform,
            application,
            product,
            journeyContext,
        }));
    });

    const uniqueTargets = new Map<string, JourneyTarget>();

    targets.forEach((target) => {
        uniqueTargets.set(
            buildTargetKey(target),
            target
        );
    });

    return [...uniqueTargets.values()].sort((left, right) =>
        buildTargetKey(left).localeCompare(buildTargetKey(right))
    );
}
