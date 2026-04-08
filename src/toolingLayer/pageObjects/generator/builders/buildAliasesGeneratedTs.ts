// src/toolingLayer/pageObjects/generator/builders/buildAliasesGeneratedTs.ts

import type { PageMap } from "../generator/types";
import { buildUrlReFromUrlPath } from "../generator/urlMeta";
import { isValidTsIdentifier } from "@utils/ts";
import { escapeForRegex } from "@utils/regex";
import {
    headerFilePath,
    getPageObjectFileParts,
} from "../utils/buildGeneratedHeader";

function toTsValue(value?: string): string {
    return value && value.trim() ? value : "undefined";
}

function optionalText(value?: string): string | undefined {
    return value && value.trim() ? value.trim() : undefined;
}

export function buildAliasesGeneratedTs(pageMap: PageMap): string {
    const lines: string[] = [];

    const scannedAt = pageMap.scannedAt ?? new Date().toISOString();
    const urlPath = optionalText(pageMap.urlPath);
    const title = optionalText(pageMap.title);

    const rawUrlRe = urlPath ? buildUrlReFromUrlPath(urlPath) : undefined;
    const urlRe = rawUrlRe && rawUrlRe.trim() ? rawUrlRe : undefined;

    const titleRe = title
        ? `new RegExp(${JSON.stringify(escapeForRegex(title))}, "i")`
        : undefined;

    lines.push(
        headerFilePath(getPageObjectFileParts(pageMap.pageKey, "aliases.generated.ts"))
    );

    lines.push(`// pageKey: ${pageMap.pageKey}`);
    lines.push(`// scannedAt: ${scannedAt}`);
    lines.push(``);
    lines.push(`import type { ElementKey } from "./elements";`);
    lines.push(``);
    lines.push(`export const pageMeta = {`);
    lines.push(`  pageKey: ${JSON.stringify(pageMap.pageKey)},`);
    lines.push(`  urlPath: ${toTsValue(urlPath ? JSON.stringify(urlPath) : undefined)},`);
    lines.push(`  urlRe: ${toTsValue(urlRe)},`);
    lines.push(`  title: ${toTsValue(title ? JSON.stringify(title) : undefined)},`);
    lines.push(`  titleRe: ${toTsValue(titleRe)},`);
    lines.push(`} as const;`);
    lines.push(``);
    lines.push(`export const aliasesGenerated = {`);

    const keys = Object.keys(pageMap.elements).sort((a, b) => a.localeCompare(b));
    for (const key of keys) {
        const prop = isValidTsIdentifier(key) ? key : JSON.stringify(key);
        lines.push(`  ${prop}: ${JSON.stringify(key)} as ElementKey,`);
    }

    lines.push(`} as const;`);
    lines.push(``);
    lines.push(`export type AliasGeneratedKey = keyof typeof aliasesGenerated;`);

    return lines.join("\n");
}