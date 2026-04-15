// src/dataLayer/builder/core/writeJson/writeValidationReport.ts

import { writeArtifactJson } from "@utils/artifacts";
import type { Application } from "@configLayer/models/application.config";
import type { JourneyContext } from "@configLayer/models/journeyContext.config";
import type { Platform } from "@configLayer/models/platform.config";
import type { Product } from "@configLayer/models/product.config";
import type { ValidationReport } from "../../types";
import type { ArtifactWriteOptions } from "./writeCasesJson";
import { DataBuilderError } from "../../errors";

export function writeValidationReport(args: {
    absBaseOut: string;
    validationReport?: ValidationReport;
    artifactOpts: ArtifactWriteOptions;
    sheetName: string;
    schemaName: string;
    platform: Platform;
    application: Application;
    product: Product;
    journeyContext: JourneyContext;
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
                platform: args.platform,
                application: args.application,
                product: args.product,
                journeyContext: args.journeyContext,
            },
        });
    }
}
