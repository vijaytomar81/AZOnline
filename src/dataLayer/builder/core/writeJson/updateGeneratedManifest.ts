// src/dataLayer/builder/core/writeJson/updateGeneratedManifest.ts

import type { Application } from "@configLayer/models/application.config";
import type { JourneyContext } from "@configLayer/models/journeyContext.config";
import type { Platform } from "@configLayer/models/platform.config";
import type { Product } from "@configLayer/models/product.config";
import { upsertGeneratedManifestItem } from "@dataLayer/runtime/manifest/generatedManifest";
import type { CasesFile } from "../../types";

export function updateGeneratedManifest(args: {
    platform: Platform;
    application: Application;
    product: Product;
    journeyContext: JourneyContext;
    sheetName: string;
    schemaName: string;
    writtenJsonPath: string;
    writtenReportPath?: string;
    casesFile: CasesFile;
}): void {
    upsertGeneratedManifestItem({
        platform: args.platform,
        application: args.application,
        product: args.product,
        journeyContext: args.journeyContext,
        sheetName: args.sheetName,
        schemaName: args.schemaName,
        filePath: args.writtenJsonPath,
        validationReportPath: args.writtenReportPath || undefined,
        caseCount: Number(
            args.casesFile.caseCount ?? args.casesFile.cases?.length ?? 0
        ),
    });
}
