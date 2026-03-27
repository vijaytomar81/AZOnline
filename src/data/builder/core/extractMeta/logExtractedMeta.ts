// src/data/builder/core/extractMeta/logExtractedMeta.ts

import { emitLog } from "@data/builder/logging/emitLog";
import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";

export function logTabularMeta(args: {
    scope: string;
    verbose: boolean;
    meta: {
        caseMetas: Array<{ row?: number; scriptId?: string; scriptName?: string }>;
        tabularHeaders?: string[];
    };
}): void {
    emitLog({
        scope: args.scope,
        category: LOG_CATEGORIES.PIPELINE,
        level: LOG_LEVELS.INFO,
        message: `Metadata extracted. Cases detected: ${args.meta.caseMetas.length}`,
    });

    if (!args.verbose) {
        return;
    }

    emitLog({
        scope: args.scope,
        category: LOG_CATEGORIES.PIPELINE,
        level: LOG_LEVELS.DEBUG,
        message: "Detected layout -> tabular",
    });

    emitLog({
        scope: args.scope,
        category: LOG_CATEGORIES.PIPELINE,
        level: LOG_LEVELS.DEBUG,
        message: `Tabular headers -> ${args.meta.tabularHeaders?.join(", ") ?? ""}`,
    });

    args.meta.caseMetas.forEach((item) => {
        emitLog({
            scope: args.scope,
            category: LOG_CATEGORIES.PIPELINE,
            level: LOG_LEVELS.DEBUG,
            message:
                `Case meta -> row=${item.row}, ` +
                `scriptId=${item.scriptId ?? ""}, ` +
                `scriptName=${item.scriptName ?? ""}`,
        });
    });
}

export function logVerticalMeta(args: {
    scope: string;
    verbose: boolean;
    meta: {
        caseMetas: Array<{ col?: number; scriptId?: string; scriptName?: string }>;
        dataStartRow: number;
        fieldCol?: number;
        caseStartCol?: number;
        scriptIdRow?: number;
        scriptNameRow?: number;
    };
}): void {
    emitLog({
        scope: args.scope,
        category: LOG_CATEGORIES.PIPELINE,
        level: LOG_LEVELS.INFO,
        message: `Metadata extracted. Cases detected: ${args.meta.caseMetas.length}`,
    });

    if (!args.verbose) {
        return;
    }

    emitLog({
        scope: args.scope,
        category: LOG_CATEGORIES.PIPELINE,
        level: LOG_LEVELS.DEBUG,
        message: "Detected layout -> vertical",
    });

    emitLog({
        scope: args.scope,
        category: LOG_CATEGORIES.PIPELINE,
        level: LOG_LEVELS.DEBUG,
        message: `Detected layout -> dataStartRow=${args.meta.dataStartRow}`,
    });

    emitLog({
        scope: args.scope,
        category: LOG_CATEGORIES.PIPELINE,
        level: LOG_LEVELS.DEBUG,
        message: `Detected layout -> fieldCol=${args.meta.fieldCol ?? ""}`,
    });

    emitLog({
        scope: args.scope,
        category: LOG_CATEGORIES.PIPELINE,
        level: LOG_LEVELS.DEBUG,
        message: `Detected layout -> caseStartCol=${args.meta.caseStartCol ?? ""}`,
    });

    emitLog({
        scope: args.scope,
        category: LOG_CATEGORIES.PIPELINE,
        level: LOG_LEVELS.DEBUG,
        message: `ScriptId row=${args.meta.scriptIdRow ?? ""}`,
    });

    emitLog({
        scope: args.scope,
        category: LOG_CATEGORIES.PIPELINE,
        level: LOG_LEVELS.DEBUG,
        message: `ScriptName row=${args.meta.scriptNameRow ?? ""}`,
    });

    emitLog({
        scope: args.scope,
        category: LOG_CATEGORIES.PIPELINE,
        level: LOG_LEVELS.DEBUG,
        message: `Case columns detected=${args.meta.caseMetas.length}`,
    });

    args.meta.caseMetas.forEach((item) => {
        emitLog({
            scope: args.scope,
            category: LOG_CATEGORIES.PIPELINE,
            level: LOG_LEVELS.DEBUG,
            message:
                `Case meta -> col=${item.col}, ` +
                `scriptId=${item.scriptId ?? ""}, ` +
                `scriptName=${item.scriptName ?? ""}`,
        });
    });
}