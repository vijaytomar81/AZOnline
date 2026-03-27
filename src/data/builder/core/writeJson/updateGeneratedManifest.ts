// src/data/builder/core/writeJson/updateGeneratedManifest.ts

import { DATA_DOMAINS } from "@utils/paths";
import { upsertGeneratedManifestItem } from "@data/runtime/generatedManifest";
import type { CasesFile } from "../../types";

export function updateGeneratedManifest(args: {
    sheetName: string;
    schemaName: string;
    writtenJsonPath: string;
    writtenReportPath?: string;
    casesFile: CasesFile;
}): void {
    upsertGeneratedManifestItem({
        domain: DATA_DOMAINS.NEW_BUSINESS,
        sheetName: args.sheetName,
        schemaName: args.schemaName,
        filePath: args.writtenJsonPath,
        validationReportPath: args.writtenReportPath || undefined,
        caseCount: Number(
            args.casesFile.caseCount ?? args.casesFile.cases?.length ?? 0
        ),
    });
}