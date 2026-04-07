// src/tools/pageObjects/generator/generator/syncAliasesHuman.ts

import fs from "node:fs";

import type { Logger } from "@utils/logger";
import { toPropertyAccess } from "./aliasParser/shared";

function replaceGeneratedRhs(line: string, oldKey: string, newKey: string): string {
    const dot = new RegExp(`\\baliasesGenerated\\.${oldKey}\\b`, "g");
    const bracket = new RegExp(`\\baliasesGenerated\$begin:math:display$\(\?\:\"\$\{oldKey\}\"\|\'\$\{oldKey\}\'\)\\$end:math:display$`, "g");
    return line.replace(dot, toPropertyAccess("aliasesGenerated", newKey)).replace(bracket, toPropertyAccess("aliasesGenerated", newKey));
}

function rewriteRenamedMappings(filePath: string, renameMap: Record<string, string>): boolean {
    if (!fs.existsSync(filePath) || Object.keys(renameMap).length === 0) return false;

    const before = fs.readFileSync(filePath, "utf8");
    const after = before
        .split("\n")
        .map((line) => Object.entries(renameMap).reduce((acc, [oldKey, newKey]) => replaceGeneratedRhs(acc, oldKey, newKey), line))
        .join("\n");

    if (before === after) return false;
    fs.writeFileSync(filePath, after, "utf8");
    return true;
}

function appendMissingAliases(filePath: string, newGeneratedKeys: string[], log: Logger): boolean {
    if (!fs.existsSync(filePath) || newGeneratedKeys.length === 0) return false;

    const txt = fs.readFileSync(filePath, "utf8");
    const used = new Set(
        [...txt.matchAll(/\baliasesGenerated(?:\.([A-Za-z_$][A-Za-z0-9_$]*)|\[(?:"([^"]+)"|'([^']+)')\])/g)]
            .map((m) => m[1] ?? m[2] ?? m[3] ?? "")
            .filter(Boolean)
    );

    const missing = newGeneratedKeys.filter((key) => !used.has(key));
    if (missing.length === 0) return false;

    const insertAt = txt.lastIndexOf("} as const satisfies");
    if (insertAt < 0) {
        log.info(`WARN: Could not append new aliases: ${filePath}`);
        return false;
    }

    const lines = missing.map((key) => `  ${key}: ${toPropertyAccess("aliasesGenerated", key)},`);
    const updated = txt.slice(0, insertAt) + lines.join("\n") + "\n" + txt.slice(insertAt);
    fs.writeFileSync(filePath, updated, "utf8");
    return true;
}

export function syncAliasesHumanFile(params: {
    aliasesHumanPath: string;
    renameMap?: Record<string, string>;
    newGeneratedKeys?: string[];
    log: Logger;
}) {
    const { aliasesHumanPath, renameMap = {}, newGeneratedKeys = [], log } = params;
    rewriteRenamedMappings(aliasesHumanPath, renameMap);
    appendMissingAliases(aliasesHumanPath, newGeneratedKeys, log);
}