// src/execution/journeys/newBusiness/pcwTool/requirePcwToolField.ts

import { AppError } from "@utils/errors";
import { normalizeSpaces } from "@utils/text";

export function requirePcwToolField(
    source: Record<string, unknown>,
    fieldName: string
): string {
    const value = normalizeSpaces(String(source[fieldName] ?? ""));

    if (!value) {
        throw new AppError({
            code: "PCW_TOOL_FIELD_MISSING",
            stage: "execution-handler",
            source: "newBusiness-pcwTool",
            message: `PCW Tool field "${fieldName}" is missing.`,
            context: { fieldName },
        });
    }

    return value;
}
