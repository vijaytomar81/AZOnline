// src/data/builder/core/plugin/pluginExecutor.ts

import type { PipelineContext, PipelinePlugin } from "../pipeline";
import { emitLog } from "@logging/emitLog";
import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";
import { resolvePluginRunOrder } from "./pluginOrder";

export async function runDiscoveredPlugins(
    ctx: PipelineContext,
    plugins: PipelinePlugin[]
): Promise<string[]> {
    const ordered = resolvePluginRunOrder(plugins);
    const verbose = !!ctx.data.verbose;

    if (verbose) {
        emitLog({
            scope: ctx.logScope,
            category: LOG_CATEGORIES.FRAMEWORK,
            level: LOG_LEVELS.DEBUG,
            message: `Run order: ${ordered.map((plugin) => plugin.name).join(" -> ")}`,
        });
    }

    for (const plugin of ordered) {
        const pluginCtx: PipelineContext = {
            ...ctx,
            logScope: `${ctx.logScope}:plugin:${plugin.name}`,
        };

        const startedAtMs = Date.now();

        if (verbose) {
            emitLog({
                scope: pluginCtx.logScope,
                category: LOG_CATEGORIES.TECHNICAL,
                level: LOG_LEVELS.DEBUG,
                message: `Plugin start: ${plugin.name}`,
            });
        }

        await plugin.run(pluginCtx);

        if (verbose) {
            const elapsedMs = Date.now() - startedAtMs;

            emitLog({
                scope: pluginCtx.logScope,
                category: LOG_CATEGORIES.TECHNICAL,
                level: LOG_LEVELS.DEBUG,
                message: `Plugin done: ${plugin.name} (${(elapsedMs / 1000).toFixed(2)}s)`,
            });
        }
    }

    return ordered.map((plugin) => plugin.name);
}