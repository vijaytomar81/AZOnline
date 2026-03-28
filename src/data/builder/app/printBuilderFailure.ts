// src/data/builder/app/printBuilderFailure.ts

import { AppError } from "@utils/errors";
import { printKeyValue, printSection } from "@utils/cliFormat";
import { setLogVerbose } from "@logging/core/logConfig";
import { emitLog } from "@logging/emitLog";
import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";
import type { FailureContext } from "./buildFailureContext";
import { printBuilderEnvironment } from "./printBuilderEnvironment";

export function printBuilderFailure(args: {
    raw: FailureContext;
    error: unknown;
    logScope: string;
}): never {
    const { raw, error, logScope } = args;
    const verbose = raw.verbose === "true";

    setLogVerbose(verbose);

    const appError =
        error instanceof AppError
            ? error
            : new AppError({
                message: error instanceof Error ? error.message : String(error),
            });

    printBuilderEnvironment(raw);

    printSection("Failure Stage");
    printKeyValue("stage", appError.stage ?? "unknown");
    printKeyValue("sourceFile", appError.source ?? "(not provided)");
    printKeyValue("code", appError.code ?? "(not provided)");

    if (appError.context && Object.keys(appError.context).length > 0) {
        printSection("Error Context");
        for (const [key, value] of Object.entries(appError.context)) {
            printKeyValue(
                key,
                typeof value === "string" ? value : JSON.stringify(value)
            );
        }
    }

    emitLog({
        scope: logScope,
        level: LOG_LEVELS.ERROR,
        message: appError.message,
        category: LOG_CATEGORIES.FRAMEWORK,
    });
    process.exit(1);
}