// src/dataLayer/runtime/cases/getCasesFile.ts

import fs from "node:fs";
import type { Application } from "@configLayer/models/application.config";
import type { JourneyContext } from "@configLayer/models/journeyContext.config";
import type { Platform } from "@configLayer/models/platform.config";
import type { Product } from "@configLayer/models/product.config";
import type { CasesFile } from "../../builder/types";
import { resolveCasesFilePath } from "./resolveCasesFilePath";

export function getCasesFile(args: {
    platform: Platform;
    application: Application;
    product: Product;
    journeyContext: JourneyContext;
    schemaName?: string;
}): CasesFile {
    const filePath = resolveCasesFilePath(args);
    const raw = fs.readFileSync(filePath, "utf-8");

    return JSON.parse(raw) as CasesFile;
}
