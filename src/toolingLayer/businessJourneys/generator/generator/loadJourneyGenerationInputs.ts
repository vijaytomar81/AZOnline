// src/toolingLayer/businessJourneys/generator/generator/loadJourneyGenerationInputs.ts

import path from "node:path";
import { safeReadJson } from "@utils/fs";
import {
    PAGE_ACTIONS_MANIFEST_DIR,
    PAGE_ACTIONS_MANIFEST_INDEX_FILE,
} from "@utils/paths";
import type {
    JourneyGenerationInputs,
    PageActionEntry,
} from "./types";

type ManifestIndex = {
    actions: Record<string, string>;
};

type ManifestEntry = {
    actionKey: string;
    pageKey: string;
    actionName: string;
    scope: {
        platform: string;
        application: string;
        product: string;
        name: string;
        namespace: string;
    };
    paths: {
        actionFile: string;
    };
};

export function loadJourneyGenerationInputs(): JourneyGenerationInputs {
    const manifest = safeReadJson<ManifestIndex>(
        PAGE_ACTIONS_MANIFEST_INDEX_FILE
    );

    if (!manifest?.actions) {
        return { pageActions: [] };
    }

    const pageActions: PageActionEntry[] = Object.values(manifest.actions)
        .map((relativePath) =>
            path.join(PAGE_ACTIONS_MANIFEST_DIR, relativePath)
        )
        .map((filePath) => safeReadJson<ManifestEntry>(filePath))
        .filter((entry): entry is ManifestEntry => Boolean(entry))
        .map((entry) => ({
            actionKey: entry.actionKey,
            pageKey: entry.pageKey,
            actionName: entry.actionName,
            scope: entry.scope,
            paths: entry.paths,
        }));

    return { pageActions };
}
