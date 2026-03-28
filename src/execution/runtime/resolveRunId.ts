// src/execution/runtime/resolveRunId.ts

function getEnvValue(name: string): string | undefined {
    const value = process.env[name]?.trim();
    return value ? value : undefined;
}

function formatPart(value: number): string {
    return String(value).padStart(2, "0");
}

function generateLocalRunId(date = new Date()): string {
    const yyyy = date.getFullYear();
    const mm = formatPart(date.getMonth() + 1);
    const dd = formatPart(date.getDate());
    const hh = formatPart(date.getHours());
    const min = formatPart(date.getMinutes());
    const ss = formatPart(date.getSeconds());

    return `local-${yyyy}${mm}${dd}-${hh}${min}${ss}`;
}

export function resolveRunId(): string {
    return (
        getEnvValue("TEST_RUN_ID") ||
        getEnvValue("BUILD_TAG") ||
        getEnvValue("BUILD_NUMBER") ||
        generateLocalRunId()
    );
}