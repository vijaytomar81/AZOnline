// src/data/builder/index.ts

import path from "node:path";
import { getArg, hasFlag, normalizeArgv } from "../../utils/argv";
import { AppError } from "../../utils/errors";
import { printSection, printKeyValue, printSummary, success, printCommandTitle } from "../../utils/cliFormat";
import { startTimer } from "../../utils/time";
import { loadPluginsFromFolder, runDiscoveredPlugins } from "./core/pluginLoader";
import { parseBuildArgs, createDataBuilderLogger } from "./cli";
import { listSchemas } from "../data-definitions";
import type { DataBuilderContext } from "./types";

type FailureContext = {
    excelPath: string;
    sheetName: string;
    schemaName: string;
    outputPath: string;
    scriptIdFilter: string;
    excludeEmptyFields: string;
    strictValidation: string;
    verbose: string;
};

function parseBoolean(v?: string): boolean {
    return ["true", "1", "yes", "y"].includes(String(v ?? "").toLowerCase());
}

function buildRawFailureContext(): FailureContext {
    const argv = normalizeArgv(process.argv.slice(2));

    const excelPath = String(getArg(argv, "--excel") ?? process.env.EXCEL_PATH ?? "").trim();
    const sheetName = String(getArg(argv, "--sheet") ?? process.env.SHEET ?? "").trim();
    const schemaName = String(getArg(argv, "--schema") ?? process.env.SCHEMA ?? "").trim();
    const outputPath = String(getArg(argv, "--out") ?? process.env.OUT_PATH ?? "").trim();
    const scriptIdFilter = String(getArg(argv, "--ids") ?? process.env.SCRIPT_IDS ?? "").trim();
    const excludeEmptyFields =
        hasFlag(argv, "--excludeEmptyFields") || parseBoolean(process.env.EXCLUDE_EMPTY_FIELDS);
    const strictValidation =
        hasFlag(argv, "--strictValidation") || parseBoolean(process.env.STRICT_VALIDATION);
    const verbose =
        hasFlag(argv, "--verbose") || parseBoolean(process.env.VERBOSE);

    return {
        excelPath: excelPath || "(not resolved)",
        sheetName: sheetName || "(not resolved)",
        schemaName: schemaName || "(not resolved)",
        outputPath: outputPath || "(not resolved)",
        scriptIdFilter: scriptIdFilter || "(all)",
        excludeEmptyFields: String(excludeEmptyFields),
        strictValidation: String(strictValidation),
        verbose: String(verbose),
    };
}

function printEnvironmentBlock(ctx: FailureContext): void {
    printSection("Environment");
    printKeyValue("excelPath", ctx.excelPath);
    printKeyValue("sheetName", ctx.sheetName);
    printKeyValue("schemaName", ctx.schemaName);
    printKeyValue("outputPath", ctx.outputPath);
    printKeyValue("scriptIdFilter", ctx.scriptIdFilter);
    printKeyValue("excludeEmptyFields", ctx.excludeEmptyFields);
    printKeyValue("strictValidation", ctx.strictValidation);
    printKeyValue("verbose", ctx.verbose);
}

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

    printEnvironmentBlock({
        excelPath: args.excelPath,
        sheetName: args.sheetName,
        schemaName: args.schemaName,
        outputPath: args.outputPath,
        scriptIdFilter: args.scriptIdFilter || "(all)",
        excludeEmptyFields: String(args.excludeEmptyFields),
        strictValidation: String(args.strictValidation),
        verbose: String(args.verbose),
    });

    printSection("Available Schemas");
    console.log(listSchemas().join(", "));

    const pluginsDirAbs = path.join(process.cwd(), "src", "data", "builder", "plugins");

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
            ["Validation - Warnings - Schema mapping fields missing in Excel", schemaMissing],
            ["Validation - Warnings - Excel fields missing in Schema", excelMissing],
            ["Total time", timer.elapsedSecondsText()],
        ],
        success("COMPLETED")
    );
}

main().catch((e: unknown) => {
    const log = createDataBuilderLogger(true);
    const raw = buildRawFailureContext();

    const error = e instanceof AppError ? e : new AppError({ message: e instanceof Error ? e.message : String(e) });

    // do NOT print banner here again
    printEnvironmentBlock(raw);

    printSection("Failure Stage");
    printKeyValue("stage", error.stage ?? "unknown");
    printKeyValue("sourceFile", error.source ?? "(not provided)");
    printKeyValue("code", error.code ?? "(not provided)");

    if (error.context && Object.keys(error.context).length > 0) {
        printSection("Error Context");
        for (const [key, value] of Object.entries(error.context)) {
            printKeyValue(key, typeof value === "string" ? value : JSON.stringify(value));
        }
    }

    log.error(error.message);
    process.exit(1);
});