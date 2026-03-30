// src/dataLayer/builder/plugins/70-write-json.ts

import type { PipelinePlugin } from "../core/pipeline";
import type { DataBuilderContext } from "../types";
import { executionConfig } from "../../../config/execution.config";
import { DATA_GENERATED_ARCHIVE_DIR } from "@utils/paths";
import { emitLog } from "@logging/emitLog";
import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";
import { resolveWriteJsonInputs } from "../core/writeJson/resolveWriteJsonInputs";
import { resolveOutputPath } from "../core/writeJson/resolveOutputPath";
import {
  writeCasesJson,
  type ArtifactWriteOptions,
} from "../core/writeJson/writeCasesJson";
import { writeValidationReport } from "../core/writeJson/writeValidationReport";
import { updateGeneratedManifest } from "../core/writeJson/updateGeneratedManifest";

const plugin: PipelinePlugin = {
  name: "write-json",
  order: 70,
  requires: [
    "casesFile",
    "external:sheetName",
    "external:outputPath",
    "external:schemaName",
  ],
  provides: ["absOut"],

  run: async (ctx: DataBuilderContext) => {
    const scope = ctx.logScope;

    const { casesFile, sheetName, schemaName } = resolveWriteJsonInputs({
      casesFile: ctx.data.casesFile,
      sheetName: ctx.data.sheetName,
      schemaName: ctx.data.schemaName,
    });

    const { absBaseOut } = resolveOutputPath({
      outputPath: ctx.data.outputPath,
      schemaName,
      sheetName,
    });

    const artifactOpts: ArtifactWriteOptions = {
      withTimestamp: executionConfig.generatedDataArtifacts.withTimestamp,
      archiveDirPath: DATA_GENERATED_ARCHIVE_DIR,
      maxToKeep: executionConfig.generatedDataArtifacts.maxToKeep,
      pretty: true,
    };

    const writtenJsonPath = writeCasesJson({
      absBaseOut,
      casesFile,
      artifactOpts,
      sheetName,
      schemaName,
    });

    ctx.data.absOut = writtenJsonPath;

    const writtenReportPath = writeValidationReport({
      absBaseOut,
      validationReport: ctx.data.validationReport,
      artifactOpts,
      sheetName,
      schemaName,
    });

    if (writtenReportPath) {
      emitLog({
        scope,
        level: LOG_LEVELS.INFO,
        category: LOG_CATEGORIES.ARTIFACT,
        message: `Validation report written: ${writtenReportPath}`,
      });
    }

    updateGeneratedManifest({
      sheetName,
      schemaName,
      writtenJsonPath,
      writtenReportPath,
      casesFile,
    });

    emitLog({
      scope,
      level: LOG_LEVELS.INFO,
      category: LOG_CATEGORIES.ARTIFACT,
      message: `JSON written: ${writtenJsonPath}`,
    });

    emitLog({
      scope,
      level: LOG_LEVELS.DEBUG,
      category: LOG_CATEGORIES.ARTIFACT,
      message: `cases=${casesFile.caseCount}`,
    });

    emitLog({
      scope,
      level: LOG_LEVELS.DEBUG,
      category: LOG_CATEGORIES.ARTIFACT,
      message:
        `generatedArtifacts.withTimestamp=${executionConfig.generatedDataArtifacts.withTimestamp}, ` +
        `archiveDir=${DATA_GENERATED_ARCHIVE_DIR}, ` +
        `maxToKeep=${executionConfig.generatedDataArtifacts.maxToKeep}`,
    });
  },
};

export default plugin;