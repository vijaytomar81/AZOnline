// src/tools/page-object-generator/generator/pageMapLoader.ts

import fs from "node:fs";
import path from "node:path";

import type { PageMap } from "./types";

export type LoadedPageMapFile = {
    file: string;
    absPath: string;
    raw: string;
    pageMap: PageMap;
};

export function readAllPageMapFiles(mapsDir: string): string[] {
    return fs
        .readdirSync(mapsDir)
        .filter((f) => f.endsWith(".json") && !f.startsWith("."))
        .sort((a, b) => a.localeCompare(b));
}

export function loadPageMapFile(mapsDir: string, file: string): LoadedPageMapFile {
    const absPath = path.join(mapsDir, file);
    const raw = fs.readFileSync(absPath, "utf8");
    const pageMap = JSON.parse(raw) as PageMap;

    if (!pageMap?.pageKey) {
        throw new Error(`Invalid page-map (missing pageKey): ${file}`);
    }

    if (!pageMap?.elements || typeof pageMap.elements !== "object") {
        throw new Error(`Invalid page-map (missing elements): ${file}`);
    }

    return {
        file,
        absPath,
        raw,
        pageMap,
    };
}