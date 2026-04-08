// src/frameworkCore/executionLayer/mode/e2e/types.ts

import type { Platform } from "@configLayer/models/platform.config";
import type { Application } from "@configLayer/models/application.config";
import type { Product } from "@configLayer/models/product.config";

export type RunE2EModeArgs = {
    excelPath: string;
    sheetName: string;
    selectedIds: string[];
    includeDisabled: boolean;
    iterations: number;
    parallel?: number;
    verbose: boolean;
    platform?: Platform;
    application?: Application;
    product?: Product;
};
