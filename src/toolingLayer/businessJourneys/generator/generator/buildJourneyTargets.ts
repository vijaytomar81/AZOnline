// src/toolingLayer/businessJourneys/generator/generator/buildJourneyTargets.ts

import { JOURNEY_ENTRY_POINTS } from "@configLayer/domain/journeyEntryPoints";
import { SUPPORTED_PRODUCTS, type SupportedProduct } from "@configLayer/domain/supportedProducts";
import { PARTNER_APPLICATIONS } from "@configLayer/domain/partnerApplications";
import { uniq } from "@utils/collections";
import type { JourneyGenerationInputs, JourneyTarget } from "./types";

function isSupportedProduct(value: string): value is SupportedProduct {
    return value === SUPPORTED_PRODUCTS.MOTOR || value === SUPPORTED_PRODUCTS.HOME;
}

function buildAthenaTargets(products: SupportedProduct[]): JourneyTarget[] {
    return products.flatMap((product) => [
        {
            application: "athena",
            product,
            journey: "newBusiness",
            entryPoint: JOURNEY_ENTRY_POINTS.DIRECT,
        },
        {
            application: "athena",
            product,
            journey: "newBusiness",
            entryPoint: JOURNEY_ENTRY_POINTS.PCW_TOOL,
        },
    ]);
}

function buildPartnerTargets(products: SupportedProduct[]): JourneyTarget[] {
    return products.flatMap((product) =>
        PARTNER_APPLICATIONS.map((application) => ({
            application,
            product,
            journey: "newBusiness",
            entryPoint: JOURNEY_ENTRY_POINTS.PCW,
        }))
    );
}

export function buildJourneyTargets(
    inputs: JourneyGenerationInputs
): JourneyTarget[] {
    const products = uniq(
        inputs.pageActions
            .filter((entry) => entry.pageKey.startsWith("athena."))
            .filter((entry) => entry.group !== "common")
            .map((entry) => entry.group)
    ).filter(isSupportedProduct);

    return [
        ...buildAthenaTargets(products),
        ...buildPartnerTargets(products),
    ];
}