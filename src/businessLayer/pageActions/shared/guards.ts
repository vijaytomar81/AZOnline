// src/businessLayer/pageActions/shared/guards.ts

import { AppError } from "@utils/errors";

export function requireStringValue(args: {
    value: unknown;
    fieldName: string;
    source: string;
}): string {
    const value = String(args.value ?? "").trim();

    if (value) {
        return value;
    }

    throw new AppError({
        code: "PAGE_ACTION_REQUIRED_VALUE_MISSING",
        stage: "page-action",
        source: args.source,
        message: `Required value "${args.fieldName}" is missing.`,
        context: {
            fieldName: args.fieldName,
        },
    });
}

export function requireRecordValue(args: {
    value: unknown;
    fieldName: string;
    source: string;
}): Record<string, unknown> {
    if (args.value && typeof args.value === "object" && !Array.isArray(args.value)) {
        return args.value as Record<string, unknown>;
    }

    throw new AppError({
        code: "PAGE_ACTION_REQUIRED_RECORD_MISSING",
        stage: "page-action",
        source: args.source,
        message: `Required object "${args.fieldName}" is missing.`,
        context: {
            fieldName: args.fieldName,
        },
    });
}
