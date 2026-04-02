// src/automation/diagnostics/isLocatorFailure.ts

const LOCATOR_FAILURE_PATTERNS = [
    "unable to resolve element",
    "waiting for locator",
    "locator.waitfor",
    "strict mode violation",
    "element is not attached",
    "element is not visible",
    "timeout",
    "no node found",
];

export function isLocatorFailure(error: unknown): boolean {
    const message =
        error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

    return LOCATOR_FAILURE_PATTERNS.some((pattern) =>
        message.includes(pattern)
    );
}
