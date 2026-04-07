// src/businessJourneyTools/business-journey-generator/generator/loadJourneyGenerationInputs.ts

import path from "node:path";
import { safeReadJson } from "@utils/fs";
import {
    PAGE_ACTIONS_MANIFEST_INDEX_FILE,
} from "@utils/paths";
import { JourneyGenerationInputs, PageActionEntry } from "./types";

type ManifestIndex = {
    actions: Record<string, string>;
};

export function loadJourneyGenerationInputs(): JourneyGenerationInputs {
    const manifest = safeReadJson<ManifestIndex>(
        PAGE_ACTIONS_MANIFEST_INDEX_FILE
    );

    if (!manifest || !manifest.actions) {
        return { pageActions: [] };
    }

    const pageActions: PageActionEntry[] = Object.entries(
        manifest.actions
    ).map(([actionKey, file]) => ({
        actionKey,
        actionFile: path.join(
            "src/pageActions/.manifest/actions",
            file
        ),
    }));

    return { pageActions };
}
