// src/execution/journeys/newBusiness/pcwTool/detectPcwToolRequestType.ts

export function detectPcwToolRequestType(
    input: string
): "XML" | "JSON" | "UNKNOWN" {
    const trimmed = input.trim();

    if (trimmed.startsWith("<")) return "XML";
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) return "JSON";

    return "UNKNOWN";
}
