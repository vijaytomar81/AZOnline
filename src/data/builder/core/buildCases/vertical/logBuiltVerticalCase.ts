// src/data/builder/core/buildCases/vertical/logBuiltVerticalCase.ts

import type { BuiltCase, DataBuilderContext } from "@data/builder/types";
import { emitLog } from "@logging/emitLog";
import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";

export function logBuiltVerticalCase(args: {
    ctx: DataBuilderContext;
    builtCase: BuiltCase;
    data: Record<string, any>;
}): void {
    const { ctx, builtCase, data } = args;

    if (!ctx.data.verbose) {
        return;
    }

    const additionalDriversCount =
        Number(data.additionalDrivers?.count ?? 0) || 0;
    const policyHolderClaimsCount =
        Number(data.policyHolderClaims?.count ?? 0) || 0;
    const policyHolderConvictionsCount =
        Number(data.policyHolderConvictions?.count ?? 0) || 0;

    emitLog({
        scope: ctx.logScope,
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.FRAMEWORK,
        message: [
            `Built case -> index=${builtCase.caseIndex}`,
            `scriptId=${builtCase.scriptId ?? ""}`,
            `scriptName=${builtCase.scriptName}`,
            `policyHolderClaims=${policyHolderClaimsCount}`,
            `policyHolderConvictions=${policyHolderConvictionsCount}`,
            `additionalDrivers=${additionalDriversCount}`,
        ].join(", "),
    });
}