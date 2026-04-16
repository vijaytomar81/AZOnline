// src/toolingLayer/pageObjects/generator/generator/pageManifest.ts

import path from "node:path";

import {
    buildPageManifestEntry,
} from "@toolingLayer/pageObjects/common/manifest/buildPageManifestEntry";
import {
    loadManifestIndex,
} from "@toolingLayer/pageObjects/common/manifest/loadManifestIndex";
import {
    loadPageManifest,
} from "@toolingLayer/pageObjects/common/manifest/loadPageManifest";
import {
    loadPageManifestEntry,
} from "@toolingLayer/pageObjects/common/manifest/loadPageManifestEntry";
import {
    removeMissingPageManifestEntries,
} from "@toolingLayer/pageObjects/common/manifest/removeMissingPageManifestEntries";
import {
    saveManifestIndex,
} from "@toolingLayer/pageObjects/common/manifest/saveManifestIndex";
import {
    savePageManifestEntry,
} from "@toolingLayer/pageObjects/common/manifest/savePageManifestEntry";

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
    manifestPagesDir: string,
    pageKey: string
): string {
    return path.join(manifestPagesDir, `${pageKey}.json`);
}
