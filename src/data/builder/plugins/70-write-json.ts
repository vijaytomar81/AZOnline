// src/data/builder/plugins/70-write-json.ts

import path from "node:path";
import type { PipelinePlugin } from "../core/pipeline";
import type { DataBuilderContext } from "../types";
import { executionConfig } from "../../../config/execution.config";
import { writeArtifactJson } from "@utils/artifacts";
import { DATA_GENERATED_ARCHIVE_DIR } from "@utils/paths";
import { toKebabFromSnake } from "@utils/text";
import { DataBuilderError } from "../errors";

function safeSheetFilename(name: string) {
  return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").trim() || "Sheet";
}

function isLikelyDir(p: string): boolean {
  const normalized = p.replace(/\\/g, "/").trim();
  if (!normalized) return true;
  if (normalized.endsWith("/")) return true;
  if (normalized.endsWith("\\")) return true;
  return path.extname(normalized) === "";
}

function getDefaultOutputPath(schemaName: string, sheetName: string): string {
  return path.join(
    "src",
    "data",
    "generated",
    "new-business",
    toKebabFromSnake(schemaName),
    `${safeSheetFilename(sheetName)}.json`
  );
}

const plugin: PipelinePlugin = {
  name: "write-json",
  order: 70,
  requires: ["casesFile", "external:sheetName", "external:outputPath", "external:schemaName"],
  provides: ["absOut"],

  run: async (ctx: DataBuilderContext) => {
    const casesFile = ctx.data.casesFile;
    if (!casesFile) {
      throw new DataBuilderError({
        code: "CASES_FILE_MISSING",
        stage: "write-json",
        source: "70-write-json",
        message: "casesFile missing. build-cases must run before write-json.",
      });
    }

    const sheetName = String(casesFile.sheet ?? ctx.data.sheetName ?? "").trim();
    if (!sheetName) {
      throw new DataBuilderError({
        code: "SHEET_NAME_MISSING",
        stage: "write-json",
        source: "70-write-json",
        message: "sheetName missing.",
      });
    }

    const schemaName = String(ctx.data.schemaName ?? "").trim();
    if (!schemaName) {
      throw new DataBuilderError({
        code: "SCHEMA_NAME_MISSING",
        stage: "write-json",
        source: "70-write-json",
        message: "schemaName missing. Ensure schema is resolved before write-json.",
      });
    }

    const outRaw = String(ctx.data.outputPath ?? "").trim();
    const configuredPath = outRaw || getDefaultOutputPath(schemaName, sheetName);

    let targetPath = configuredPath;
    if (isLikelyDir(configuredPath)) {
      targetPath = path.join(configuredPath, `${safeSheetFilename(sheetName)}.json`);
    }

    const absBaseOut = path.isAbsolute(targetPath)
      ? targetPath
      : path.join(process.cwd(), targetPath);

    const artifactOpts = {
      withTimestamp: executionConfig.generatedArtifacts.withTimestamp,
      archiveDirPath: DATA_GENERATED_ARCHIVE_DIR,
      maxToKeep: executionConfig.generatedArtifacts.maxToKeep,
      pretty: true,
    };

    let writtenJsonPath = "";
    try {
      writtenJsonPath = writeArtifactJson(absBaseOut, casesFile, artifactOpts);
      ctx.data.absOut = writtenJsonPath;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new DataBuilderError({
        code: "JSON_WRITE_FAILED",
        stage: "write-json",
        source: "70-write-json",
        message: `Failed to write cases JSON: ${message}`,
        context: {
          targetPath: absBaseOut,
          sheetName,
          schemaName,
        },
      });
    }

    if (ctx.data.validationReport) {
      const baseReportPath = absBaseOut.replace(/\.json$/i, ".validation.json");

      try {
        const writtenReportPath = writeArtifactJson(
          baseReportPath,
          ctx.data.validationReport,
          artifactOpts
        );

        ctx.data.validationReport.reportPath = writtenReportPath;
        ctx.log.info(`Validation report written: ${writtenReportPath}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new DataBuilderError({
          code: "VALIDATION_REPORT_WRITE_FAILED",
          stage: "write-json",
          source: "70-write-json",
          message: `Failed to write validation report: ${message}`,
          context: {
            targetPath: baseReportPath,
            sheetName,
            schemaName,
          },
        });
      }
    }

    ctx.log.info(`JSON written: ${writtenJsonPath}`);
    ctx.log.debug?.(`cases=${casesFile.caseCount}`);
    ctx.log.debug?.(
      `generatedArtifacts.withTimestamp=${executionConfig.generatedArtifacts.withTimestamp}, archiveDir=${DATA_GENERATED_ARCHIVE_DIR}, maxToKeep=${executionConfig.generatedArtifacts.maxToKeep}`
    );
  },
};

export default plugin;