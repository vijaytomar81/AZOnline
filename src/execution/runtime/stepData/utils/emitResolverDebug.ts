// src/execution/runtime/stepData/utils/emitResolverDebug.ts

import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { emitLog } from "@logging/emitLog";
import { normalizeSpaces } from "@utils/text";
import type { DebugCollector } from "../types";

export function emitResolverDebug(args: {
    message: string;
    logScope: string;
    debugCollector?: DebugCollector;
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
