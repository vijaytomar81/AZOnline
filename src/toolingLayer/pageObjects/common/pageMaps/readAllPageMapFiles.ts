// src/toolingLayer/pageObjects/common/pageMaps/readAllPageMapFiles.ts

import { listPageMapFiles } from "@toolingLayer/pageObjects/common/readPageMap";

export function readAllPageMapFiles(mapsDir: string): string[] {
    return listPageMapFiles(mapsDir);
}
