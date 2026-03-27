// src/data/builder/core/plugin/pluginModuleLoader.ts

import path from "node:path";
import url from "node:url";
import { createRequire } from "node:module";
import { DataBuilderError } from "../../errors";

function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

export async function loadPluginModule(fileAbs: string): Promise<unknown> {
    const requireFromProject = createRequire(
        path.join(process.cwd(), "package.json")
    );

    try {
        const fileUrl = url.pathToFileURL(fileAbs).href;
        return await import(fileUrl);
    } catch (importError: unknown) {
        try {
            return requireFromProject(fileAbs);
        } catch (requireError: unknown) {
            throw new DataBuilderError({
                code: "PLUGIN_LOAD_FAILED",
                stage: "plugin-scan",
                source: "pluginModuleLoader",
                message: [
                    `Failed to load plugin file: ${fileAbs}`,
                    `- import(): ${getErrorMessage(importError)}`,
                    `- require(): ${getErrorMessage(requireError)}`,
                ].join("\n"),
                context: {
                    fileAbs,
                },
            });
        }
    }
}