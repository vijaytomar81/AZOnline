// src/executionLayer/runtime/itemData/utils/emitResolverDebug.ts

import { LOG_CATEGORIES } from "@frameworkCore/logging/core/logCategories";
import { emitLog } from "@frameworkCore/logging/emitLog";
import { normalizeSpaces } from "@utils/text";
import type { ExecutionItemDataDebugCollector } from "../types";

export function emitResolverDebug(args: {
    message: string;
    logScope: string;
    debugCollector?: ExecutionItemDataDebugCollector;
}): void {
    const text = normalizeSpaces(args.message);

    if (!text) {
        return;
    }

    if (args.debugCollector) {
        args.debugCollector.push(text);
        return;
    }

    emitLog({
        scope: args.logScope,
        level: "debug",
        category: LOG_CATEGORIES.TECHNICAL,
        message: text,
    });
}
