// src/dataLayer/builder/app/runDataBuilder.ts

import path from "node:path";
import { printCommandTitle } from "@utils/cliFormat";
import { startTimer } from "@utils/time";
import { DATA_BUILDER_PLUGINS_DIR } from "@utils/paths";
import { listSchemas } from "../../data-definitions";
import { parseBuildArgs } from "../cli";
import type { DataBuilderContext } from "../types";
import {
    loadPluginsFromFolder,
    resolvePluginRunOrder,
    runDiscoveredPlugins,
} from "../core/pluginLoader";
import { setLogVerbose } from "@frameworkCore/logging/core/logConfig";
import { emitLog } from "@frameworkCore/logging/emitLog";
import { LOG_CATEGORIES } from "@frameworkCore/logging/core/logCategories";
import { LOG_LEVELS } from "@frameworkCore/logging/core/logLevels";
import {
    printAvailableSchemas,
    printBuilderEnvironment,
    printPipelineOrder,
} from "./printBuilderEnvironment";
import { printBuilderSummary } from "./printBuilderSummary";

export async function runDataBuilder(): Promise<void> {
    printCommandTitle("DATA BUILDER", "dataBuilderIcon");

    const timer = startTimer();
    const args = parseBuildArgs();
    const logScope = "data-builder";

    setLogVerbose(args.verbose);

    const ctx: DataBuilderContext = {
        logScope,
        data: {
            excelPath: args.excelPath,
            sheetName: args.sheetName,
            schemaName: args.schemaName,
            outputPath: args.outputPath,
            scriptIdFilter: args.scriptIdFilter,
            excludeEmptyFields: args.excludeEmptyFields,
            strictValidation: args.strictValidation,
            verbose: args.verbose,
        },
    };

    printBuilderEnvironment({
        excelPath: args.excelPath,
        sheetName: args.sheetName,
        schemaName: args.schemaName,
        outputPath: args.outputPath,
        scriptIdFilter: args.scriptIdFilter || "(all)",
        excludeEmptyFields: String(args.excludeEmptyFields),
        strictValidation: String(args.strictValidation),
        verbose: String(args.verbose),
    });

    printAvailableSchemas(listSchemas());

    const pluginsDirAbs = DATA_BUILDER_PLUGINS_DIR;

    console.log("");
    console.log("Scanning plugins");
    console.log("----------------");

    const discovered = await loadPluginsFromFolder({
        pluginsDirAbs,
        verbose: args.verbose,
        logScope: `${logScope}:plugin-loader`,
    });

    const plugins = discovered.map((item) => item.plugin);
    const orderedPlugins = resolvePluginRunOrder(plugins);

    printPipelineOrder(orderedPlugins.map((plugin) => plugin.name));

    emitLog({
        scope: logScope,
        level: LOG_LEVELS.INFO,
        message: "Starting schema-driven Data Builder...",
        category: LOG_CATEGORIES.FRAMEWORK,
    });

    const ranNames = await runDiscoveredPlugins(ctx, orderedPlugins);

    printBuilderSummary({
        ctx,
        schemaName: args.schemaName,
        strictValidation: args.strictValidation,
        pluginsExecuted: ranNames.length,
        totalTime: timer.elapsedSecondsText(),
    });
}