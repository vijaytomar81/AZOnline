// src/dataLayer/builder/plugins/30-filter-scriptIds.ts

import type { PipelinePlugin } from "../core/pipeline";
import type { DataBuilderContext } from "../types";
import { DataBuilderError } from "../errors";
import { emitLog } from "@frameworkCore/logging/emitLog";
import { LOG_CATEGORIES } from "@frameworkCore/logging/core/logCategories";
import { LOG_LEVELS } from "@frameworkCore/logging/core/logLevels";
import {
    applyScriptIdFilter,
    expandScriptIdFilter,
    validateFilteredScriptIds,
} from "../core/filterScriptIds";

const plugin: PipelinePlugin = {
    name: "filter-scriptIds",
    order: 30,
    requires: ["casesFile", "external:scriptIdFilter"],

    run: async (ctx: DataBuilderContext) => {
        const casesFile = ctx.data.casesFile;
        const scope = ctx.logScope;
        const rawFilter = String(ctx.data.scriptIdFilter ?? "").trim();

        if (!casesFile) {
            throw new DataBuilderError({
                code: "CASES_FILE_MISSING",
                stage: "filter-scriptIds",
                source: "30-filter-scriptIds",
                message: "casesFile missing. build-cases must run before filter-scriptIds.",
            });
        }

        if (!rawFilter) {
            emitLog({
                scope,
                level: LOG_LEVELS.INFO,
                category: LOG_CATEGORIES.PIPELINE,
                message: "No scriptId filter provided. Keeping all cases.",
            });
            return;
        }

        const allowed = expandScriptIdFilter(rawFilter);

        if (allowed.size === 0) {
            throw new DataBuilderError({
                code: "EMPTY_SCRIPT_ID_FILTER",
                stage: "filter-scriptIds",
                source: "30-filter-scriptIds",
                message: "scriptIdFilter provided but no valid IDs found.",
                context: { rawFilter },
            });
        }

        emitLog({
            scope,
            level: LOG_LEVELS.INFO,
            category: LOG_CATEGORIES.PIPELINE,
            message: `Filtering script IDs: ${rawFilter}`,
        });

        const { before, filteredIds } = applyScriptIdFilter(casesFile, allowed);

        validateFilteredScriptIds({
            allowed,
            found: filteredIds,
            casesFile,
        });

        emitLog({
            scope,
            level: LOG_LEVELS.INFO,
            category: LOG_CATEGORIES.PIPELINE,
            message: `Cases after filter: ${casesFile.caseCount} (from ${before})`,
        });
    },
};

export default plugin;