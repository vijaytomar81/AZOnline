// src/executionLayer/mode/e2e/types.ts

import type {
    Application,
    Product,
} from "@configLayer/domain/routing.config";

export type RunE2EModeArgs = {
    excelPath: string;
    sheetName: string;
    selectedIds: string[];
    includeDisabled: boolean;
    iterations: number;
    parallel?: number;
    verbose: boolean;
    application?: Application;
    product?: Product;
};
