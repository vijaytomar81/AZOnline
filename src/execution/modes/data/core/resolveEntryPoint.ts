// src/execution/modes/data/core/resolveEntryPoint.ts

export function resolveEntryPoint(
    schemaName: string
): "Direct" | "PCW" | "PCWTool" {
    if (schemaName === "direct" || schemaName === "master") return "Direct";
    if (schemaName.includes("pcw_tool")) return "PCWTool";
    return "PCW";
}
