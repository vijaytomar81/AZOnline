// src/frameworkCore/executionLayer/cli/main.ts

import { getArg, hasFlag, normalizeArgv } from "@utils/argv";
import { normalizeSpaces } from "@utils/text";
import { AppError } from "@utils/errors";
import { setLogVerbose } from "@frameworkCore/logging/core/logConfig";
import {
    printDataModeHelp,
    runDataMode,
} from "@frameworkCore/executionLayer/mode/data";
import {
    printE2EModeHelp,
    runE2EMode,
} from "@frameworkCore/executionLayer/mode/e2e";
import {
    JOURNEY_TYPES,
    MTA_TYPES,
    type JourneyContext,
    type MtaType,
} from "@configLayer/models/journeyContext.config";
import { parseParallel } from "./parseParallel";
import {
    parsePlatform,
    parseApplication,
    parseProduct,
} from "./parseRoutingArgs";
import { handleExecutionError } from "./handleExecutionError";

function normalizeMode(raw?: string): "data" | "e2e" {
    return String(raw ?? "e2e").trim().toLowerCase() === "data"
        ? "data"
        : "e2e";
}

function parseIterations(raw?: string): number {
    const value = normalizeSpaces(String(raw ?? ""));

    if (!value) {
        return 1;
    }

    const num = Number(value);

    if (!Number.isInteger(num) || num <= 0) {
        return 1;
    }

    return num;
}

function parseScenarioFilter(raw?: string): string[] {
    return String(raw ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

function parseJourneySubType(raw?: string): MtaType | undefined {
    const value = normalizeSpaces(String(raw ?? ""));

    if (!value) {
        return undefined;
    }

    const allowed = Object.values(MTA_TYPES);
    const resolved = allowed.find(
        (item) => item.toLowerCase() === value.toLowerCase()
    );

    if (resolved) {
        return resolved;
    }

    throw new AppError({
        code: "INVALID_JOURNEY_SUBTYPE",
        stage: "cli-parse",
        source: "main.ts",
        message: `Invalid --journeySubType value "${raw}". Allowed: ${allowed.join(", ")}.`,
    });
}

function parseJourneyContext(args: {
    journeyContextRaw?: string;
    journeySubTypeRaw?: string;
}): JourneyContext | undefined {
    const value = normalizeSpaces(String(args.journeyContextRaw ?? ""));
    const subType = parseJourneySubType(args.journeySubTypeRaw);

    if (!value) {
        return undefined;
    }

    if (value === JOURNEY_TYPES.NEW_BUSINESS) {
        return { type: JOURNEY_TYPES.NEW_BUSINESS };
    }

    if (value === JOURNEY_TYPES.RENEWAL) {
        return { type: JOURNEY_TYPES.RENEWAL };
    }

    if (value === JOURNEY_TYPES.MTC) {
        return { type: JOURNEY_TYPES.MTC };
    }

    if (value === JOURNEY_TYPES.MTA) {
        if (!subType) {
            throw new AppError({
                code: "JOURNEY_SUBTYPE_MISSING",
                stage: "cli-parse",
                source: "main.ts",
                message:
                    `When --journeyContext is "${JOURNEY_TYPES.MTA}", ` +
                    `--journeySubType is required. Allowed: ${Object.values(MTA_TYPES).join(", ")}.`,
            });
        }

        return {
            type: JOURNEY_TYPES.MTA,
            subType,
        };
    }

    throw new AppError({
        code: "INVALID_JOURNEY_CONTEXT",
        stage: "cli-parse",
        source: "main.ts",
        message: `Invalid --journeyContext value "${args.journeyContextRaw}".`,
    });
}

async function main(): Promise<void> {
    const argv = normalizeArgv(process.argv.slice(2));
    const mode = normalizeMode(String(getArg(argv, "--mode") ?? "e2e"));

    if (hasFlag(argv, "--help") || hasFlag(argv, "-h")) {
        if (mode === "data") {
            printDataModeHelp();
        } else {
            printE2EModeHelp();
        }

        return;
    }

    const verbose = hasFlag(argv, "--verbose");
    setLogVerbose(verbose);

    const iterations = parseIterations(
        String(getArg(argv, "--iterations") ?? "")
    );
    const parallel = parseParallel(
        String(getArg(argv, "--parallel") ?? "")
    );

    const platform = parsePlatform(
        String(getArg(argv, "--platform") ?? "")
    );
    const application = parseApplication(
        String(getArg(argv, "--application") ?? "")
    );
    const product = parseProduct(
        String(getArg(argv, "--product") ?? "")
    );

    if (mode === "data") {
        const journeyContext = parseJourneyContext({
            journeyContextRaw: String(getArg(argv, "--journeyContext") ?? ""),
            journeySubTypeRaw: String(getArg(argv, "--journeySubType") ?? ""),
        });

        if (!platform || !application || !product || !journeyContext) {
            throw new Error(
                "Data mode requires --platform, --application, --product, and --journeyContext."
            );
        }

        await runDataMode({
            iterations,
            parallel,
            verbose,
            platform,
            application,
            product,
            journeyContext,
        });

        return;
    }

    await runE2EMode({
        excelPath: normalizeSpaces(
            String(getArg(argv, "--excel") ?? "")
        ),
        sheetName: normalizeSpaces(
            String(getArg(argv, "--sheet") ?? "")
        ),
        selectedIds: parseScenarioFilter(
            String(getArg(argv, "--scenario") ?? "")
        ),
        includeDisabled: hasFlag(argv, "--includeDisabled"),
        iterations,
        parallel,
        verbose,
        platform,
        application,
        product,
    });
}

main().catch(handleExecutionError);
