// src/utils/time.ts

export type Timer = {
    elapsedSeconds: () => number;
    elapsedSecondsText: () => string;
};

export function startTimer(): Timer {
    const start = Date.now();

    return {
        elapsedSeconds: () => (Date.now() - start) / 1000,
        elapsedSecondsText: () => ((Date.now() - start) / 1000).toFixed(2) + "s",
    };
}

export function nowIso(): string {
    return new Date().toISOString();
}
