// src/data/builder/core/plugin/pluginDiscovery.ts

import path from "node:path";
import type { PipelinePlugin } from "../pipeline";
import { emitLog } from "@data/builder/logging/emitLog";
import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";
import {
    ensurePluginsFolderExists,
    getPluginFiles,
} from "./pluginFileScanner";
import { loadPluginModule } from "./pluginModuleLoader";
import {
    pickPluginExport,
    validateDuplicatePluginNames,
} from "./pluginValidator";

export type DiscoveredPlugin = {
    file: string;
    plugin: PipelinePlugin;
};

function logDiscoveredPlugins(args: {
    discovered: DiscoveredPlugin[];
    logScope: string;
    verbose: boolean;
}): void {
    if (!args.verbose) {
        return;
    }

    emitLog({
        scope: args.logScope,
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.TECHNICAL,
        message: `Discovered plugins (${args.discovered.length}):`,
    });

    args.discovered.forEach((item) => {
        emitLog({
            scope: args.logScope,
            level: LOG_LEVELS.DEBUG,
            category: LOG_CATEGORIES.TECHNICAL,
            message: `- name=${item.plugin.name} file=${path.basename(item.file)}`,
        });
    });
}

export async function loadPluginsFromFolder(opts: {
    pluginsDirAbs: string;
    verbose?: boolean;
    onlyNames?: string[];
    logScope?: string;
}): Promise<DiscoveredPlugin[]> {
    const {
        pluginsDirAbs,
        verbose = false,
        onlyNames,
        logScope = "data-builder:plugin-loader",
    } = opts;

    ensurePluginsFolderExists(pluginsDirAbs);

    const files = getPluginFiles(pluginsDirAbs);
    const discovered: DiscoveredPlugin[] = [];

    for (const fileAbs of files) {
        const mod = await loadPluginModule(fileAbs);
        const plugin = pickPluginExport(mod);

        if (!plugin) {
            if (verbose) {
                emitLog({
                    scope: logScope,
                    level: LOG_LEVELS.DEBUG,
                    message: `Skipping ${path.basename(fileAbs)} (no plugin export found)`,
                });
            }
            continue;
        }

        if (onlyNames?.length && !onlyNames.includes(plugin.name)) {
            if (verbose) {
                emitLog({
                    scope: logScope,
                    level: LOG_LEVELS.DEBUG,
                    message: `Skipping ${plugin.name} (not in onlyNames allowlist)`,
                });
            }
            continue;
        }

        discovered.push({ file: fileAbs, plugin });
    }

    validateDuplicatePluginNames(discovered);
    logDiscoveredPlugins({ discovered, logScope, verbose });

    return discovered;
}