// src/businessLayer/businessJourneys/runtime/resolveBusinessJourney.ts

import { createRequire } from "node:module";
import { AppError } from "@utils/errors";
import type { JourneyContext } from "@configLayer/models/journeyContext.config";
import { JOURNEY_TYPES } from "@configLayer/models/journeyContext.config";
import type { Platform } from "@configLayer/models/platform.config";
import type { Application } from "@configLayer/models/application.config";
import type { Product } from "@configLayer/models/product.config";
import type { BusinessJourney } from "@businessLayer/businessJourneys/framework";

const requireModule = createRequire(__filename);

function normalizeSegment(value: string): string {
    return value;
}

function toPascalCase(value: string): string {
    return value
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/[_\-.]+/g, " ")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join("");
}

function buildJourneyFolderSegments(
    context: JourneyContext
): string[] {
    if (context.type === JOURNEY_TYPES.MTA) {
        return [
            context.type,
            context.subType,
        ];
    }

    return [context.type];
}

function buildJourneyExportName(
    context: JourneyContext
): string {
    if (context.type === JOURNEY_TYPES.MTA) {
        return `run${toPascalCase(context.subType)}MtaJourney`;
    }

    return `run${toPascalCase(context.type)}Journey`;
}

function buildModulePath(args: {
    platform: Platform;
    application: Application;
    product: Product;
    journeyContext: JourneyContext;
}): string {
    return [
        "@businessLayer/businessJourneys",
        normalizeSegment(args.platform),
        normalizeSegment(args.application),
        normalizeSegment(args.product),
        ...buildJourneyFolderSegments(args.journeyContext),
    ].join("/");
}

export function resolveBusinessJourney(args: {
    platform: Platform;
    application: Application;
    product: Product;
    journeyContext: JourneyContext;
}): BusinessJourney {
    const modulePath = buildModulePath(args);
    const exportName = buildJourneyExportName(args.journeyContext);

    try {
        const moduleRef = requireModule(modulePath) as Record<string, unknown>;
        const journey = moduleRef[exportName];

        if (typeof journey === "function") {
            return journey as BusinessJourney;
        }

        throw new AppError({
            code: "BUSINESS_JOURNEY_EXPORT_NOT_FOUND",
            stage: "business-journey",
            source: "resolveBusinessJourney",
            message: `Business journey export "${exportName}" was not found in "${modulePath}".`,
            context: {
                modulePath,
                exportName,
            },
        });
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError({
            code: "BUSINESS_JOURNEY_NOT_FOUND",
            stage: "business-journey",
            source: "resolveBusinessJourney",
            message:
                `Unable to resolve business journey "${exportName}" ` +
                `from "${modulePath}".`,
            context: {
                modulePath,
                exportName,
                cause: error instanceof Error ? error.message : String(error),
            },
        });
    }
}
