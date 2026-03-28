// src/execution/core/step/createStepDebugCollector.ts

export type StepDebugCollector = {
    push(message: string): void;
    all(): string[];
};

export function createStepDebugCollector(): StepDebugCollector {
    const debugLines: string[] = [];

    return {
        push(message: string): void {
            const text = String(message ?? "").trim();

            if (text) {
                debugLines.push(text);
            }
        },
        all(): string[] {
            return [...debugLines];
        },
    };
}
