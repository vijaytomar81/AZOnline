// src/toolingLayer/businessJourneys/generator/generator/buildJourneyTargets.ts

import { APPLICATIONS, type Application } from "@configLayer/models/application.config";
import { JOURNEY_TYPES } from "@configLayer/models/journeyContext.config";
import {
    isApplicationAllowedOnPlatform,
} from "@configLayer/models/platformApplication.config";
import { PLATFORMS, type Platform } from "@configLayer/models/platform.config";
import { PRODUCTS, type Product } from "@configLayer/models/product.config";
import type { JourneyGenerationInputs, JourneyTarget } from "./types";

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

export function buildJourneyTargets(
    inputs: JourneyGenerationInputs
): JourneyTarget[] {
    const keys = new Set<string>();

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

            keys.add([platform, application, product].join("|"));
        });

    return [...keys]
        .map((key) => {
            const [platform, application, product] = key.split("|");

            return {
                platform: platform as Platform,
                application: application as Application,
                product: product as Product,
                journeyType: JOURNEY_TYPES.NEW_BUSINESS,
            };
        })
        .sort((left, right) =>
            [
                String(left.platform),
                String(left.application),
                String(left.product),
                String(left.journeyType),
            ]
                .join(".")
                .localeCompare(
                    [
                        String(right.platform),
                        String(right.application),
                        String(right.product),
                        String(right.journeyType),
                    ].join(".")
                )
        );
}
