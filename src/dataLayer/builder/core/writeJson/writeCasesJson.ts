// src/dataLayer/builder/core/writeJson/writeCasesJson.ts

import { writeArtifactJson } from "@utils/artifacts";
import type { Application } from "@configLayer/models/application.config";
import type { JourneyContext } from "@configLayer/models/journeyContext.config";
import type { Platform } from "@configLayer/models/platform.config";
import type { Product } from "@configLayer/models/product.config";
import type { CasesFile } from "../../types";
import { DataBuilderError } from "../../errors";

export type ArtifactWriteOptions = {
    withTimestamp: boolean;
    archiveDirPath: string;
    maxToKeep: number;
    pretty: boolean;
};

export function writeCasesJson(args: {
    absBaseOut: string;
    casesFile: CasesFile;
    artifactOpts: ArtifactWriteOptions;
    sheetName: string;
    schemaName: string;
    platform: Platform;
    application: Application;
    product: Product;
    journeyContext: JourneyContext;
}): string {
    try {
        return writeArtifactJson(
            args.absBaseOut,
            args.casesFile,
            args.artifactOpts
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        throw new DataBuilderError({
            code: "JSON_WRITE_FAILED",
            stage: "write-json",
            source: "writeCasesJson",
            message: `Failed to write cases JSON: ${message}`,
            context: {
                targetPath: args.absBaseOut,
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
