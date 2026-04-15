// src/frameworkCore/executionLayer/core/item/createExecutionItemDebugCollector.ts

export function createExecutionItemDebugCollector() {
    const debugLines: string[] = [];

    return {
        push(message: string): void {
            const text = String(message ?? "").trim();

            if (text) {
                debugLines.push(text);
            }
        },
        all(): string[] {
            return debugLines;
        },
    };
}
