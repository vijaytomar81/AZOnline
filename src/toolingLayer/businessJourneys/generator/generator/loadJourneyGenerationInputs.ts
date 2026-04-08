// src/toolingLayer/businessJourneys/generator/generator/loadJourneyGenerationInputs.ts

import path from "node:path";
import { safeReadJson } from "@utils/fs";
import {
    PAGE_ACTIONS_MANIFEST_ACTIONS_DIR,
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
    group: string;
    actionName: string;
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
        .map((fileName) =>
            path.join(PAGE_ACTIONS_MANIFEST_ACTIONS_DIR, fileName)
        )
        .map((filePath) => safeReadJson<ManifestEntry>(filePath))
        .filter((entry): entry is ManifestEntry => Boolean(entry))
        .map((entry) => ({
            actionKey: entry.actionKey,
            pageKey: entry.pageKey,
            group: entry.group,
            actionName: entry.actionName,
            actionFile: entry.paths.actionFile,
        }));

    return { pageActions };
}
