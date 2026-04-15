// src/dataLayer/builder/cli/showBuilderHelp.ts

import { printSection } from "@utils/cliFormat";
import { emitLog } from "@frameworkCore/logging/emitLog";
import { LOG_CATEGORIES } from "@frameworkCore/logging/core/logCategories";
import { LOG_LEVELS } from "@frameworkCore/logging/core/logLevels";
import { usage } from "../help";

export function showBuilderHelp(logScope: string): never {
    printSection("Data Builder Help");

    emitLog({
        scope: logScope,
        level: LOG_LEVELS.INFO,
        message: usage(),
        category: LOG_CATEGORIES.FRAMEWORK,
    });

    process.exit(0);
}