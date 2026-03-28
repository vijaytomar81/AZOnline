// src/data/builder/plugins/50-transform-values.ts

import type { PipelinePlugin } from "../core/pipeline";
import type { DataBuilderContext } from "../types";
import { DataBuilderError } from "../errors";
import { emitLog } from "@logging/emitLog";
import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";
import { transformCasesFile } from "../core/transformValues";

const plugin: PipelinePlugin = {
    name: "transform-values",
    order: 50,
    requires: ["casesFile"],

    run: async (ctx: DataBuilderContext) => {
        const casesFile = ctx.data.casesFile;
        const scope = ctx.logScope;

        if (!casesFile) {
            throw new DataBuilderError({
                code: "CASES_FILE_MISSING",
                stage: "transform-values",
                source: "50-transform-values",
                message: "casesFile missing. build-cases must run before transform-values.",
            });
        }

        const result = transformCasesFile(casesFile);
        ctx.data.casesFile = result.casesFile;

        emitLog({
            scope,
            level: LOG_LEVELS.INFO,
            category: LOG_CATEGORIES.PIPELINE,
            message: `Value transformation applied to ${result.transformedCount} case(s).`,
        });

        emitLog({
            scope,
            level: LOG_LEVELS.DEBUG,
            category: LOG_CATEGORIES.PIPELINE,
            message: "Transforms: trim strings, convert count/count-like values to numbers.",
        });
    },
};

export default plugin;