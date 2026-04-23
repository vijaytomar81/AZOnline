// src/toolingLayer/pageObjects/generator/generator/registry/index.ts

import path from "node:path";

import type { PageManifestEntry } from "../pageManifest";
import { loadManifestIndex, loadPageManifestEntry } from "../pageManifest";
import {
    generatePagesIndexFromEntries,
    type GeneratePagesIndexResult,
} from "./generatePagesIndex";
import {
    generatePageManagerFromEntries,
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

function loadManifestEntries(manifestDir: string): PageManifestEntry[] {
    const index = loadManifestIndex(path.join(manifestDir, "index.json"));

    return Object.values(index.pages)
        .map((fileName) => loadPageManifestEntry(path.join(manifestDir, fileName)))
        .filter((entry): entry is PageManifestEntry => Boolean(entry))
        .sort((a, b) => a.pageKey.localeCompare(b.pageKey));
}

export function generatePageRegistryFromManifest(
    manifestDir: string,
    pagesDir?: string
): SyncPageRegistryResult {
    const entries = loadManifestEntries(manifestDir);

    return {
        index: generatePagesIndexFromEntries(entries, pagesDir),
        pageManager: generatePageManagerFromEntries(entries, pagesDir),
    };
}

export type {
    GeneratePagesIndexResult as SyncPagesIndexResult,
    GeneratePageManagerResult as SyncPageManagerResult,
};
