// src/execution/runtime/loadScenario/types.ts

import type { RawScenarioRow } from "@execution/modes/e2e/scenario/types";

export type LoadScenarioSheetResult = {
    sheetName: string;
    headers: string[];
    rows: RawScenarioRow[];
};
