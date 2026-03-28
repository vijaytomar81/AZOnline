// src/data/builder/core/extractMeta/logExtractedMeta.ts

import { emitLog } from "@logging/emitLog";
import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";

function logSummary(scope: string, count: number) {
    emitLog({
        scope,
        category: LOG_CATEGORIES.PIPELINE,
        level: LOG_LEVELS.INFO,
        message: `Metadata extracted. Cases detected: ${count}`,
    });
}

function logDebug(scope: string, message: string) {
    emitLog({
        scope,
        category: LOG_CATEGORIES.PIPELINE,
        level: LOG_LEVELS.DEBUG,
        message,
    });
}

/* ---------------- TABULAR ---------------- */

export function logTabularMeta(args: {
    scope: string;
    verbose: boolean;
    meta: {
        caseMetas: Array<{ row?: number; scriptId?: string; scriptName?: string }>;
        tabularHeaders?: string[];
    };
}): void {
    const { scope, verbose, meta } = args;

    logSummary(scope, meta.caseMetas.length);

    if (!verbose) return;

    logDebug(scope, "Detected layout -> tabular");
    logDebug(scope, `Tabular headers -> ${meta.tabularHeaders?.join(", ") ?? ""}`);

    meta.caseMetas.forEach((item) => {
        logDebug(
            scope,
            `Case meta -> row=${item.row}, scriptId=${item.scriptId ?? ""}, scriptName=${item.scriptName ?? ""}`
        );
    });
}

/* ---------------- VERTICAL ---------------- */

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
    const { scope, verbose, meta } = args;

    logSummary(scope, meta.caseMetas.length);

    if (!verbose) return;

    logDebug(scope, "Detected layout -> vertical");
    logDebug(scope, `Detected layout -> dataStartRow=${meta.dataStartRow}`);
    logDebug(scope, `Detected layout -> fieldCol=${meta.fieldCol ?? ""}`);
    logDebug(scope, `Detected layout -> caseStartCol=${meta.caseStartCol ?? ""}`);
    logDebug(scope, `ScriptId row=${meta.scriptIdRow ?? ""}`);
    logDebug(scope, `ScriptName row=${meta.scriptNameRow ?? ""}`);
    logDebug(scope, `Case columns detected=${meta.caseMetas.length}`);

    meta.caseMetas.forEach((item) => {
        logDebug(
            scope,
            `Case meta -> col=${item.col}, scriptId=${item.scriptId ?? ""}, scriptName=${item.scriptName ?? ""}`
        );
    });
}