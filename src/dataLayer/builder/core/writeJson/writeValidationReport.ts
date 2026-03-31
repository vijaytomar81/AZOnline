// src/dataLayer/builder/core/writeJson/writeValidationReport.ts

import { writeArtifactJson } from "@utils/artifacts";
import type { ValidationReport } from "../../types";
import type { ArtifactWriteOptions } from "./writeCasesJson";
import { DataBuilderError } from "../../errors";

export function writeValidationReport(args: {
    absBaseOut: string;
    validationReport?: ValidationReport;
    artifactOpts: ArtifactWriteOptions;
    sheetName: string;
    schemaName: string;
}): string {
    if (!args.validationReport) {
        return "";
    }

    const baseReportPath = args.absBaseOut.replace(/\.json$/i, ".validation.json");

    try {
        const writtenReportPath = writeArtifactJson(
            baseReportPath,
            args.validationReport,
            args.artifactOpts
        );

        args.validationReport.reportPath = writtenReportPath;
        return writtenReportPath;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        throw new DataBuilderError({
            code: "VALIDATION_REPORT_WRITE_FAILED",
            stage: "write-json",
            source: "writeValidationReport",
            message: `Failed to write validation report: ${message}`,
            context: {
                targetPath: baseReportPath,
                sheetName: args.sheetName,
                schemaName: args.schemaName,
            },
        });
    }
}