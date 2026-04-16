// src/toolingLayer/pageObjects/generator/generator/pageManifest.ts

import { buildPageManifestEntry } from "@toolingLayer/pageObjects/common/manifest/buildPageManifestEntry";
import { loadManifestIndex } from "@toolingLayer/pageObjects/common/manifest/loadManifestIndex";
import { loadPageManifest } from "@toolingLayer/pageObjects/common/manifest/loadPageManifest";
import { loadPageManifestEntry } from "@toolingLayer/pageObjects/common/manifest/loadPageManifestEntry";
import {
    getManifestEntryFile,
} from "@toolingLayer/pageObjects/common/manifest/manifestPaths";
import { removeMissingPageManifestEntries } from "@toolingLayer/pageObjects/common/manifest/removeMissingPageManifestEntries";
import { saveManifestIndex } from "@toolingLayer/pageObjects/common/manifest/saveManifestIndex";
import { savePageManifestEntry } from "@toolingLayer/pageObjects/common/manifest/savePageManifestEntry";

export type {
    BuildPageManifestEntryResult,
    ManifestIndex,
    PageManifestEntry,
    PageObjectsManifest,
} from "@toolingLayer/pageObjects/common/manifest/types";

export {
    buildPageManifestEntry,
    loadManifestIndex,
    loadPageManifest,
    loadPageManifestEntry,
    removeMissingPageManifestEntries,
    saveManifestIndex,
    savePageManifestEntry,
};

export function pageKeyToManifestFile(
    manifestRoot: string,
    pageKey: string
): string {
    return getManifestEntryFile(manifestRoot, pageKey);
}
