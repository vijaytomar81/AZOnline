// src/frameworkCore/executionLayer/core/item/diffExecutionOutputs.ts

function cloneValue<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}

export function cloneExecutionOutputs(
    outputs: Record<string, unknown>
): Record<string, unknown> {
    return cloneValue(outputs ?? {});
}

export function diffExecutionOutputs(args: {
    before: Record<string, unknown>;
    after: Record<string, unknown>;
}): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    const keys = new Set([
        ...Object.keys(args.before ?? {}),
        ...Object.keys(args.after ?? {}),
    ]);

    keys.forEach((key) => {
        const beforeValue = JSON.stringify(args.before[key]);
        const afterValue = JSON.stringify(args.after[key]);

        if (beforeValue !== afterValue && key in args.after) {
            result[key] = args.after[key];
        }
    });

    return result;
}
