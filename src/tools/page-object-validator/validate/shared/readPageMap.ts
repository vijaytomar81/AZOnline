// src/tools/page-object-validator/validate/shared/readPageMap.ts

import path from "node:path";

import { listFiles, safeReadJson } from "@/utils/fs";
import type { PageMap } from "@/tools/page-object-generator/generator/types";
import type { LoadedPageMap } from "./types";

export function listPageMapFiles(mapsDir: string): string[] {
    return listFiles(mapsDir, { ext: ".json" }).filter((f) => !f.startsWith("."));
}

export function loadAllPageMaps(mapsDir: string): LoadedPageMap[] {
    const files = listPageMapFiles(mapsDir);
    const loaded: LoadedPageMap[] = [];

    for (const fileName of files) {
        const absPath = path.join(mapsDir, fileName);
        const pageMap = safeReadJson<PageMap>(absPath);

        if (!pageMap?.pageKey || !pageMap?.elements || typeof pageMap.elements !== "object") {
            continue;
        }

        loaded.push({
            fileName,
            absPath,
            pageMap,
        });
    }

    return loaded.sort((a, b) => a.pageMap.pageKey.localeCompare(b.pageMap.pageKey));
}