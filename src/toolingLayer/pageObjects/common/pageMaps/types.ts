// src/toolingLayer/pageObjects/common/pageMaps/types.ts

import type { PageMap } from "@toolingLayer/pageObjects/generator/generator/types";

export type LoadedPageMap = {
    fileName: string;
    absPath: string;
    pageMap: PageMap;
};

export type LoadedPageMapFile = {
    file: string;
    absPath: string;
    raw: string;
    pageMap: PageMap;
};
