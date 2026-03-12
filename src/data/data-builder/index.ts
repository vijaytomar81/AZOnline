// src/data/data-builder/index.ts

import path from "node:path";

import { parseBuildArgs, createDataBuilderLogger } from "./cli";
import { startTimer } from "../../utils/time";
import { loadPluginsFromFolder, runDiscoveredPlugins } from "./core/pluginLoader";
import {
    printSection,
    printKeyValue,
    printSummary,
    success,
    printCommandTitle,
} from "../../utils/cliFormat";

import type { DataBuilderContext } from "./types";

async function main() {
    printCommandTitle("DATA BUILDER", "dataBuilderIcon");
    const timer = startTimer();

    const args = parseBuildArgs();
    const log = createDataBuilderLogger(args.verbose);

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

    log.info("Command: build");

    printSection("Environment");
    printKeyValue("excelPath", args.excelPath);
    printKeyValue("sheetName", args.sheetName);
    printKeyValue("outputPath", args.outputPath);
    printKeyValue("verbose", args.verbose);

    const pluginsDirAbs = path.join(process.cwd(), "src", "data", "data-builder", "plugins");

    printSection("Scanning plugins");

    const discovered = await loadPluginsFromFolder({
        pluginsDirAbs,
        verbose: args.verbose,
        log: log.child("plugin-loader"),
    });

    const plugins = discovered.map((d) => d.plugin);

    console.log(`Found ${plugins.length} plugin(s)`);

    printSection("Pipeline order");
    console.log(plugins.map((p) => p.name).join(" -> "));

    log.info("Starting Data Builder (Level-4 output)...");

    const ranNames = await runDiscoveredPlugins(ctx as any, plugins);

    const absOut = ctx.data.absOut ?? "";
    const caseCount = ctx.data.casesFile?.caseCount ?? 0;

    log.info(`Plugins executed: ${ranNames.join(", ")}`);
    log.info(`Cases written: ${caseCount}`);
    log.info(`Output: ${absOut}`);
    log.info(`Total time: ${timer.elapsedSecondsText()}`);
    log.info("Done ✅");

    printSummary(
        "DATA BUILDER SUMMARY",
        [
            ["Plugins executed", ranNames.length],
            ["Cases generated", caseCount],
            ["Output file", absOut || "(not set)"],
            ["Total time", timer.elapsedSecondsText()],
        ],
        success("COMPLETED")
    );
}

main().catch((e: any) => {
    const log = createDataBuilderLogger(true);
    const msg = e?.message ?? String(e);
    log.error(msg);
    process.exit(1);
});