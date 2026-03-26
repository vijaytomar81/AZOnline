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

export function formatTimestamp(date = new Date()): string {
    const yyyy = String(date.getFullYear());
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    const ms = String(date.getMilliseconds()).padStart(3, "0");

    return `${yyyy}${mm}${dd}_${hh}${min}${ss}_${ms}`;
}