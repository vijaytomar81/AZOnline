// src/tools/page-object-generator/generator/registry/index.ts

import { PAGE_OBJECTS_MANIFEST_FILE } from "@/utils/paths";
import { loadPageManifest, type PageObjectsManifest } from "../pageManifest";
import {
    generatePagesIndexFromManifest,
    type GeneratePagesIndexResult,
} from "./generatePagesIndex";
import {
    generatePageManagerFromManifest,
    type GeneratePageManagerResult,
} from "./generatePageManager";

export type PageRegistryEntry = {
    pageKey: string;
    className: string;
};

export type SyncPageRegistryResult = {
    index: GeneratePagesIndexResult;
    pageManager: GeneratePageManagerResult;
};

export function generatePageRegistryFromManifest(
    manifestFilePath = PAGE_OBJECTS_MANIFEST_FILE,
    pagesDir?: string
): SyncPageRegistryResult {
    const manifest: PageObjectsManifest = loadPageManifest(manifestFilePath);

    return {
        index: generatePagesIndexFromManifest(manifest, pagesDir),
        pageManager: generatePageManagerFromManifest(manifest, pagesDir),
    };
}

export type {
    GeneratePagesIndexResult as SyncPagesIndexResult,
    GeneratePageManagerResult as SyncPageManagerResult,
};