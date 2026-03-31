// src/dataLayer/builder/cli/resolveOutputPath.ts

import path from "node:path";
import { getGeneratedSchemaDir, toRepoRelative } from "@utils/paths";

function safeSheetFilename(name: string): string {
    return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").trim() || "Sheet";
}

export function resolveOutputPath(args: {
    outRaw: string;
    schemaName: string;
    sheetName: string;
}): string {
    if (args.outRaw) {
        return args.outRaw;
    }

    return toRepoRelative(
        path.join(
            getGeneratedSchemaDir(args.schemaName),
            `${safeSheetFilename(args.sheetName)}.json`
        )
    );
}