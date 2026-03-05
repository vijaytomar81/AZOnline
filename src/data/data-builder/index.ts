// src/data/data-builder/index.ts

import path from "node:path";

import { parseBuildArgs } from "./cli";
import { createLogger } from "../../utils/logger";
import { startTimer } from "../../utils/time";
import { loadPluginsFromFolder, runDiscoveredPlugins } from "./core/pluginLoader";

import type { DataBuilderContext } from "./types";

async function main() {
    const timer = startTimer();

    const args = parseBuildArgs();

    const log = createLogger({
        prefix: "[data-builder]",
        verbose: args.verbose,
        withTimestamp: true,
        logToFile: false,
    });

    const ctx: DataBuilderContext = {
        log,
        data: {
            excelPath: args.excelPath,
            sheetName: args.sheetName,
            outputPath: args.outputPath,
            scriptIdFilter: args.scriptIdFilter,
            includeEmptyChildFields: args.includeEmptyChildFields,
            verbose: args.verbose,
        },
    };

    log.info("Starting Data Builder (Level-4 output)...");

    const pluginsDirAbs = path.join(process.cwd(), "src", "data", "data-builder", "plugins");

    const discovered = await loadPluginsFromFolder({
        pluginsDirAbs,
        verbose: args.verbose,
        log,
    });

    const plugins = discovered.map((d) => d.plugin);

    const ranNames = await runDiscoveredPlugins(ctx as any, plugins);

    const absOut = ctx.data.absOut ?? "";
    const caseCount = ctx.data.casesFile?.caseCount ?? 0;

    log.info(`Plugins executed: ${ranNames.join(", ")}`);
    log.info(`Cases written: ${caseCount}`);
    log.info(`Output: ${absOut}`);
    log.info(`Total time: ${timer.elapsedSecondsText()}`);
    log.info("Done ✅");
}

main().catch((e: any) => {
    const msg = e?.message ?? String(e);
    console.error(`[data-builder] ERROR: ${msg}`);
    process.exit(1);
});