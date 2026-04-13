// src/frameworkCore/executionLayer/cli/main.ts

import { getArg, hasFlag, normalizeArgv } from "@utils/argv";
import { normalizeSpaces } from "@utils/text";
import { setLogVerbose } from "@frameworkCore/logging/core/logConfig";
import {
    printDataModeHelp,
    runDataMode,
} from "@frameworkCore/executionLayer/mode/data";
import {
    printE2EModeHelp,
    runE2EMode,
} from "@frameworkCore/executionLayer/mode/e2e";
import { parseMode } from "./parsers/mode/parseMode";
import { parseIterations } from "./parsers/execution/parseIterations";
import { parseParallel } from "./parsers/execution/parseParallel";
import { parseScenarioFilter } from "./parsers/execution/parseScenarioFilter";
import { parsePlatform } from "./parsers/routing/parsePlatform";
import { parseApplication } from "./parsers/routing/parseApplication";
import { parseProduct } from "./parsers/routing/parseProduct";
import { parseJourneyContext } from "./parsers/journey/parseJourneyContext";
import { parseEnvironment } from "./parsers/environment/parseEnvironment";
import { handleExecutionError } from "./handlers/handleExecutionError";

async function main(): Promise<void> {
    const argv = normalizeArgv(process.argv.slice(2));
    const mode = parseMode(String(getArg(argv, "--mode") ?? "e2e"));

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
    const environment = parseEnvironment(
        String(getArg(argv, "--environment") ?? "")
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
            environment,
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
        environment,
        platform,
        application,
        product,
    });
}

main().catch(handleExecutionError);