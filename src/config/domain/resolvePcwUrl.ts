// src/config/domain/resolvePcwUrl.ts

import { AppError } from "@utils/errors";
import type { Application, Product } from "@config/environments";
import { envConfig } from "@config/env";
import { normalizeJourney, JOURNEYS } from "./journey.config";

export function resolvePcwUrl(args: {
    application: Application;
    product: Product;
    journey: string;
}): string {
    const appUrls = envConfig.env.applications[args.application];

    if (!appUrls) {
        throw new AppError({
            code: "APPLICATION_URLS_MISSING",
            stage: "route-resolution",
            source: "resolvePcwUrl",
            message: `Application "${args.application}" is not configured for environment "${envConfig.name}".`,
            context: {
                environment: envConfig.name,
                application: args.application,
            },
        });
    }

    const journey = normalizeJourney(args.journey);

    if (journey === JOURNEYS.DIRECT) {
        throw new AppError({
            code: "PCW_JOURNEY_INVALID",
            stage: "route-resolution",
            source: "resolvePcwUrl",
            message: 'Journey "Direct" cannot be used with entry point "PCW".',
            context: {
                application: args.application,
                product: args.product,
                journey: args.journey,
            },
        });
    }

    const url = appUrls.partnerEntryUrls[args.product]?.[
        journey as keyof typeof appUrls.partnerEntryUrls[typeof args.product]
    ];

    if (url) {
        return url;
    }

    throw new AppError({
        code: "PCW_URL_MISSING",
        stage: "route-resolution",
        source: "resolvePcwUrl",
        message: `No PCW URL configured for application="${args.application}", product="${args.product}", journey="${journey}".`,
        context: {
            environment: envConfig.name,
            application: args.application,
            product: args.product,
            journey,
        },
    });
}
