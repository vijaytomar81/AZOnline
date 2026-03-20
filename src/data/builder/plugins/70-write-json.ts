// src/data/builder/plugins/70-write-json.ts

import path from "node:path";
import type { PipelinePlugin } from "../core/pipeline";
import type { DataBuilderContext } from "../types";
import { executionConfig } from "../../../config/execution.config";
import { writeArtifactJson } from "../../../utils/artifacts";
import { DATA_GENERATED_ARCHIVE_DIR } from "../../../utils/paths";

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
    schemaName,
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
      throw new Error("casesFile missing. build-cases must run before write-json.");
    }

    const sheetName = String(casesFile.sheet ?? ctx.data.sheetName ?? "").trim();
    if (!sheetName) throw new Error("sheetName missing.");

    const schemaName = String(ctx.data.schemaName ?? "").trim();
    if (!schemaName) {
      throw new Error("schemaName missing. Ensure schema is resolved before write-json.");
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

    const writtenJsonPath = writeArtifactJson(absBaseOut, casesFile, artifactOpts);
    ctx.data.absOut = writtenJsonPath;

    if (ctx.data.validationReport) {
      const baseReportPath = absBaseOut.replace(/\.json$/i, ".validation.json");
      const writtenReportPath = writeArtifactJson(
        baseReportPath,
        ctx.data.validationReport,
        artifactOpts
      );

      ctx.data.validationReport.reportPath = writtenReportPath;
      ctx.log.info(`Validation report written: ${writtenReportPath}`);
    }

    ctx.log.info(`JSON written: ${writtenJsonPath}`);
    ctx.log.debug?.(`cases=${casesFile.caseCount}`);
    ctx.log.debug?.(
      `generatedArtifacts.withTimestamp=${executionConfig.generatedArtifacts.withTimestamp}, archiveDir=${DATA_GENERATED_ARCHIVE_DIR}, maxToKeep=${executionConfig.generatedArtifacts.maxToKeep}`
    );
  },
};

export default plugin;