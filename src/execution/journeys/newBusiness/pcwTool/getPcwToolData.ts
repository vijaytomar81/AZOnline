// src/execution/journeys/newBusiness/pcwTool/getPcwToolData.ts

export function getPcwToolData(
    stepData?: Record<string, unknown>
): Record<string, unknown> {
    return (stepData?.pcwTool ?? {}) as Record<string, unknown>;
}
