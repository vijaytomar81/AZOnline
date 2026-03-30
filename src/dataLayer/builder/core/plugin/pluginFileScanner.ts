// src/dataLayer/builder/core/plugin/pluginFileScanner.ts

import fs from "node:fs";
import path from "node:path";
import { DataBuilderError } from "../../errors";

function isTsOrJs(file: string): boolean {
    return file.endsWith(".ts") || file.endsWith(".js");
}

export function ensurePluginsFolderExists(pluginsDirAbs: string): void {
    if (fs.existsSync(pluginsDirAbs)) {
        return;
    }

    throw new DataBuilderError({
        code: "PLUGINS_FOLDER_NOT_FOUND",
        stage: "plugin-scan",
        source: "pluginFileScanner",
        message: `Plugins folder not found: ${pluginsDirAbs}`,
        context: {
            pluginsDirAbs,
        },
    });
}

export function getPluginFiles(pluginsDirAbs: string): string[] {
    return fs
        .readdirSync(pluginsDirAbs)
        .filter((file) => isTsOrJs(file))
        .map((file) => path.join(pluginsDirAbs, file));
}