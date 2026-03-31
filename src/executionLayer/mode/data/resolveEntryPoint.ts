// src/executionLayer/mode/data/resolveEntryPoint.ts

import type { ExecutionEntryPoint } from "@executionLayer/contracts";

export function resolveEntryPoint(
    schemaName: string
): ExecutionEntryPoint {
    if (schemaName === "direct" || schemaName === "master") {
        return "Direct";
    }

    if (schemaName.includes("pcw_tool")) {
        return "PCWTool";
    }

    return "PCW";
}
