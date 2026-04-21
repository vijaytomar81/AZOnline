// src/toolingLayer/pageActions/generator/core/manifestSync/loadPageActionManifestIndex.ts

import fs from "node:fs";
import { PAGE_ACTIONS_MANIFEST_INDEX_FILE } from "@utils/paths";
import type { PageActionManifestIndex } from "../../manifest/types";

function emptyIndex(): PageActionManifestIndex {
    return {
        version: 1,
        generatedAt: new Date().toISOString(),
        actions: {},
    };
}

export function loadPageActionManifestIndex(): PageActionManifestIndex {
    if (!fs.existsSync(PAGE_ACTIONS_MANIFEST_INDEX_FILE)) {
        return emptyIndex();
    }

    try {
        const parsed = JSON.parse(
            fs.readFileSync(PAGE_ACTIONS_MANIFEST_INDEX_FILE, "utf8")
        ) as Partial<PageActionManifestIndex>;

        return {
            version: 1,
            generatedAt:
                typeof parsed.generatedAt === "string"
                    ? parsed.generatedAt
                    : new Date().toISOString(),
            actions:
                parsed.actions && typeof parsed.actions === "object"
                    ? parsed.actions
                    : {},
        };
    } catch {
        return emptyIndex();
    }
}
