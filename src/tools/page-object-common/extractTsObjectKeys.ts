// src/tools/page-object-common/extractTsObjectKeys.ts

import {
    extractExportedObjectBody,
    splitTopLevelObjectEntries,
    stripTsComments,
} from "./tsObjectParser";

function extractKeyFromEntry(entry: string): string | undefined {
    const match = entry.match(
        /^(?:"([^"]+)"|'([^']+)'|([A-Za-z_$][A-Za-z0-9_$]*))\s*:/
    );

    return match?.[1] ?? match?.[2] ?? match?.[3] ?? undefined;
}

export function extractExportedObjectKeys(
    tsText: string,
    constName: string
): Set<string> {
    const body = extractExportedObjectBody(tsText, constName);
    if (!body) return new Set<string>();

    const keys = new Set<string>();

    for (const entry of splitTopLevelObjectEntries(body)) {
        const key = extractKeyFromEntry(entry);
        if (key) keys.add(key);
    }

    return keys;
}

export function extractReferencedObjectKeys(
    tsText: string,
    objectName: string
): Set<string> {
    const keys = new Set<string>();
    const cleaned = stripTsComments(tsText);

    const re = new RegExp(
        `\\b${objectName}(?:\\.([A-Za-z_$][A-Za-z0-9_$]*)|\$begin:math:display$\(\?\:\"\(\[\^\"\]\+\)\"\|\'\(\[\^\'\]\+\)\'\)\\$end:math:display$)`,
        "g"
    );

    let match: RegExpExecArray | null;
    while ((match = re.exec(cleaned))) {
        const key = match[1] ?? match[2] ?? match[3];
        if (key) keys.add(key);
    }

    return keys;
}

export function extractMethodNames(tsText: string): Set<string> {
    const methods = new Set<string>();

    const re =
        /^\s*(?:public|protected|private)?\s*async\s+([A-Za-z_$][A-Za-z0-9_$]*)\s*\(/gm;

    let match: RegExpExecArray | null;
    while ((match = re.exec(tsText))) {
        if (match[1]) methods.add(match[1]);
    }

    return methods;
}

export function extractStringFieldFromExportedObject(
    tsText: string,
    constName: string,
    fieldName: string
): string | undefined {
    const body = extractExportedObjectBody(tsText, constName);
    if (!body) return undefined;

    const entry = splitTopLevelObjectEntries(body).find((item) =>
        new RegExp(`^(?:"${fieldName}"|'${fieldName}'|${fieldName})\\s*:`).test(item.trim())
    );

    if (!entry) return undefined;

    const match = entry.match(/:\s*(?:"([^"]*)"|'([^']*)')/);
    return match?.[1] ?? match?.[2] ?? undefined;
}