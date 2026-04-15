// src/frameworkCore/executionLayer/mode/e2e/scenario/normalize/normalizeScenarioList.ts

import type { Platform } from "@configLayer/models/platform.config";
import type { Application } from "@configLayer/models/application.config";
import type { Product } from "@configLayer/models/product.config";
import type { ExecutionScenario } from "@frameworkCore/executionLayer/contracts";
import type { RawExecutionScenarioRow } from "../types";
import { normalizeScenarioRow } from "./normalizeScenarioRow";

export function normalizeScenarioList(
    rows: RawExecutionScenarioRow[],
    opts: {
        platform?: Platform;
        application?: Application;
        product?: Product;
    } = {}
): ExecutionScenario[] {
    return rows.map((row) =>
        normalizeScenarioRow(row, {
            platform: opts.platform,
            application: opts.application,
            product: opts.product,
        })
    );
}
