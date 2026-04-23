// src/toolingLayer/businessJourneys/generator/generator/buildJourneyTargets.ts

import { APPLICATIONS } from "@configLayer/models/application.config";
import { JOURNEY_TYPES } from "@configLayer/models/journeyContext.config";
import {
    PCW_APPLICATIONS,
    PCW_TOOL_APPLICATIONS,
} from "@configLayer/models/platformApplication.config";
import { PLATFORMS } from "@configLayer/models/platform.config";
import type { Product } from "@configLayer/models/product.config";
import type { JourneyGenerationInputs, JourneyTarget } from "./types";

function normalize(value: string): string {
    return value.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

function getAvailableProducts(inputs: JourneyGenerationInputs): Product[] {
    const values = inputs.pageActions
        .filter(
            (entry) =>
                normalize(entry.scope.platform) === "athena" &&
                normalize(entry.scope.application) === "azonline" &&
                normalize(entry.scope.product) !== "common"
        )
        .map((entry) => entry.scope.product);

    return [...new Set(values)] as Product[];
}

function buildAthenaTargets(products: Product[]): JourneyTarget[] {
    return products.map((product) => ({
        entryPlatform: PLATFORMS.ATHENA,
        entryApplication: APPLICATIONS.AZ_ONLINE,
        destinationPlatform: PLATFORMS.ATHENA,
        destinationApplication: APPLICATIONS.AZ_ONLINE,
        product,
        journeyType: JOURNEY_TYPES.NEW_BUSINESS,
    }));
}

function buildPcwTargets(products: Product[]): JourneyTarget[] {
    return PCW_APPLICATIONS.flatMap((entryApplication) =>
        products.map((product) => ({
            entryPlatform: PLATFORMS.PCW,
            entryApplication,
            destinationPlatform: PLATFORMS.ATHENA,
            destinationApplication: APPLICATIONS.AZ_ONLINE,
            product,
            journeyType: JOURNEY_TYPES.NEW_BUSINESS,
        }))
    );
}

function buildPcwToolTargets(products: Product[]): JourneyTarget[] {
    return PCW_TOOL_APPLICATIONS.flatMap((entryApplication) =>
        products.map((product) => ({
            entryPlatform: PLATFORMS.PCW_TOOL,
            entryApplication,
            destinationPlatform: PLATFORMS.ATHENA,
            destinationApplication: APPLICATIONS.AZ_ONLINE,
            product,
            journeyType: JOURNEY_TYPES.NEW_BUSINESS,
        }))
    );
}

export function buildJourneyTargets(
    inputs: JourneyGenerationInputs
): JourneyTarget[] {
    const products = getAvailableProducts(inputs);

    return [
        ...buildAthenaTargets(products),
        ...buildPcwTargets(products),
        ...buildPcwToolTargets(products),
    ];
}
