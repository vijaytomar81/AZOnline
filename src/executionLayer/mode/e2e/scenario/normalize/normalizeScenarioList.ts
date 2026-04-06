// src/executionLayer/mode/e2e/scenario/normalize/normalizeScenarioList.ts

import type { ExecutionScenario } from "@executionLayer/contracts";
import type {
    Application,
    Product,
} from "@config/domain/routing.config";
import type { RawExecutionScenarioRow } from "../types";
import { normalizeScenarioRow } from "./normalizeScenarioRow";

export function normalizeScenarioList(
    rows: RawExecutionScenarioRow[],
    opts: {
        application?: Application;
        product?: Product;
    } = {}
): ExecutionScenario[] {
    return rows.map((row) =>
        normalizeScenarioRow(row, {
            application: opts.application,
            product: opts.product,
        })
    );
}
