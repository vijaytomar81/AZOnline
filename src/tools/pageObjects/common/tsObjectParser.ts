// src/tools/pageObjects/common/tsObjectParser.ts

import { stripLineComments } from "@utils/text";

function findMatchingBrace(text: string, openIndex: number): number {
    let depth = 0;
    let inSingle = false;
    let inDouble = false;
    let inTemplate = false;
    let escaped = false;

    for (let i = openIndex; i < text.length; i++) {
        const ch = text[i];

        if (inSingle) {
            if (!escaped && ch === "'") inSingle = false;
            escaped = !escaped && ch === "\\";
            continue;
        }

        if (inDouble) {
            if (!escaped && ch === '"') inDouble = false;
            escaped = !escaped && ch === "\\";
            continue;
        }

        if (inTemplate) {
            if (!escaped && ch === "`") inTemplate = false;
            escaped = !escaped && ch === "\\";
            continue;
        }

        if (ch === "'") {
            inSingle = true;
            escaped = false;
            continue;
        }

        if (ch === '"') {
            inDouble = true;
            escaped = false;
            continue;
        }

        if (ch === "`") {
            inTemplate = true;
            escaped = false;
            continue;
        }

        if (ch === "{") {
            depth++;
            continue;
        }

        if (ch === "}") {
            depth--;
            if (depth === 0) return i;
        }
    }

    return -1;
}

export function extractExportedObjectBody(
    tsText: string,
    constName: string
): string | null {
    const exportMatch = new RegExp(
        `export\\s+const\\s+${constName}\\s*=\\s*\\{`,
        "m"
    ).exec(tsText);

    if (!exportMatch || exportMatch.index < 0) {
        return null;
    }

    const openIndex = tsText.indexOf("{", exportMatch.index);
    if (openIndex < 0) return null;

    const closeIndex = findMatchingBrace(tsText, openIndex);
    if (closeIndex < 0) return null;

    return tsText.slice(openIndex + 1, closeIndex);
}

export function splitTopLevelObjectEntries(body: string): string[] {
    const entries: string[] = [];
    let start = 0;
    let depth = 0;
    let inSingle = false;
    let inDouble = false;
    let inTemplate = false;
    let escaped = false;

    for (let i = 0; i < body.length; i++) {
        const ch = body[i];

        if (inSingle) {
            if (!escaped && ch === "'") inSingle = false;
            escaped = !escaped && ch === "\\";
            continue;
        }

        if (inDouble) {
            if (!escaped && ch === '"') inDouble = false;
            escaped = !escaped && ch === "\\";
            continue;
        }

        if (inTemplate) {
            if (!escaped && ch === "`") inTemplate = false;
            escaped = !escaped && ch === "\\";
            continue;
        }

        if (ch === "'") {
            inSingle = true;
            escaped = false;
            continue;
        }

        if (ch === '"') {
            inDouble = true;
            escaped = false;
            continue;
        }

        if (ch === "`") {
            inTemplate = true;
            escaped = false;
            continue;
        }

        if (ch === "{") {
            depth++;
            continue;
        }

        if (ch === "}") {
            depth--;
            continue;
        }

        if (ch === "," && depth === 0) {
            const chunk = body.slice(start, i).trim();
            if (chunk) entries.push(chunk);
            start = i + 1;
        }
    }

    const tail = body.slice(start).trim();
    if (tail) entries.push(tail);

    return entries;
}

export function stripTsComments(tsText: string): string {
    return stripLineComments(tsText).replace(/\/\*[\s\S]*?\*\//g, "");
}