// src/toolingLayer/businessJourneys/generator/generator/buildJourneyTargets.ts

import { uniq } from "@utils/collections";
import type { JourneyGenerationInputs, JourneyTarget } from "./types";

const PARTNER_APPLICATIONS = ["msm", "ctm", "cnf", "goco"] as const;
type SupportedProduct = "motor" | "home";

function isSupportedProduct(value: string): value is SupportedProduct {
    return value === "motor" || value === "home";
}

function buildAthenaTargets(products: SupportedProduct[]): JourneyTarget[] {
    return products.flatMap((product) => [
        {
            application: "athena",
            product,
            journey: "newBusiness",
            entryPoint: "direct",
        },
        {
            application: "athena",
            product,
            journey: "newBusiness",
            entryPoint: "pcwTool",
        },
    ]);
}

function buildPartnerTargets(products: SupportedProduct[]): JourneyTarget[] {
    return products.flatMap((product) =>
        PARTNER_APPLICATIONS.map((application) => ({
            application,
            product,
            journey: "newBusiness",
            entryPoint: "pcw",
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
