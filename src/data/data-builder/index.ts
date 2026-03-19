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
import { listSchemas } from "../input-data-schema";
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
            schemaName: args.schemaName,
            outputPath: args.outputPath,
            scriptIdFilter: args.scriptIdFilter,
            excludeEmptyFields: args.excludeEmptyFields,
            strictValidation: args.strictValidation,
            verbose: args.verbose,
        },
    };

    printSection("Environment");
    printKeyValue("excelPath", args.excelPath);
    printKeyValue("sheetName", args.sheetName);
    printKeyValue("schemaName", args.schemaName);
    printKeyValue("outputPath", args.outputPath);
    printKeyValue("scriptIdFilter", args.scriptIdFilter || "(all)");
    printKeyValue("excludeEmptyFields", args.excludeEmptyFields);
    printKeyValue("strictValidation", args.strictValidation);
    printKeyValue("verbose", args.verbose);

    printSection("Available Schemas");
    console.log(listSchemas().join(", "));

    const pluginsDirAbs = path.join(process.cwd(), "src", "data", "data-builder", "plugins");

    printSection("Scanning plugins");
    const discovered = await loadPluginsFromFolder({
        pluginsDirAbs,
        verbose: args.verbose,
        log: log.child("plugin-loader"),
    });

    const plugins = discovered.map((d) => d.plugin);

    printSection("Pipeline order");
    console.log(plugins.map((p) => p.name).join(" -> "));

    log.info("Starting schema-driven Data Builder...");
    const ranNames = await runDiscoveredPlugins(ctx, plugins);
    const absOut = ctx.data.absOut ?? "";
    const caseCount = ctx.data.casesFile?.caseCount ?? 0;

    const validation = ctx.data.validationReport;

    const validationPath = validation?.reportPath ?? "(not generated)";
    const errorCount = validation?.summary.errorCount ?? 0;
    const schemaMissing = validation?.summary.missingSchemaFieldsInExcelCount ?? 0;
    const excelMissing = validation?.summary.missingExcelFieldsInSchemaCount ?? 0;

    printSummary(
        "DATA BUILDER SUMMARY",
        [
            ["Schema", args.schemaName],
            ["Strict validation", args.strictValidation ? "true" : "false"],
            ["Plugins executed", ranNames.length],
            ["Cases generated", caseCount],
            ["Test Data Output file", absOut || "(not set)"],
            ["Validation - Report", validationPath],
            ["Validation - Total errors", errorCount],
            ["Validation - Schema → Excel missing (Schema mapping fields missing in Excel)", schemaMissing],
            ["Validation - Excel → Schema missing (Excel fields missing in Schema)", excelMissing],
            ["Total time", timer.elapsedSecondsText()],
        ],
        success("COMPLETED")
    );
}

main().catch((e: any) => {
    const log = createDataBuilderLogger(true);
    log.error(e?.message ?? String(e));
    process.exit(1);
});