// src/tools/page-object-validator/validate/shared/types.ts

import type { PageMap } from "@/tools/page-object-generator/generator/types";

export type LoadedPageMap = {
    fileName: string;
    absPath: string;
    pageMap: PageMap;
};