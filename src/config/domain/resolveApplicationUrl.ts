// src/config/domain/resolveApplicationUrl.ts

import { AppError } from "@utils/errors";
import type { Application } from "@config/environments";
import { envConfig } from "@config/env";

export function resolveApplicationUrl(args: {
    application: Application;
    key: "customerPortalUrl" | "supportPortalUrl" | "pcwTestToolUrl" | "backdatingToolUrl";
}): string {
    const appUrls = envConfig.env.applications[args.application];

    if (!appUrls) {
        throw new AppError({
            code: "APPLICATION_URLS_MISSING",
            stage: "route-resolution",
            source: "resolveApplicationUrl",
            message: `Application "${args.application}" is not configured for environment "${envConfig.name}".`,
            context: {
                environment: envConfig.name,
                application: args.application,
                key: args.key,
            },
        });
    }

    const url = appUrls[args.key];

    if (url) {
        return url;
    }

    throw new AppError({
        code: "APPLICATION_URL_MISSING",
        stage: "route-resolution",
        source: "resolveApplicationUrl",
        message: `URL "${args.key}" is missing for application "${args.application}" in environment "${envConfig.name}".`,
        context: {
            environment: envConfig.name,
            application: args.application,
            key: args.key,
        },
    });
}
