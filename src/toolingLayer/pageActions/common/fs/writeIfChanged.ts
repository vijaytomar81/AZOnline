// src/toolingLayer/pageActions/common/fs/writeIfChanged.ts

import fs from "node:fs";
import path from "node:path";

export type WriteIfChangedResult = {
    changed: boolean;
    created: boolean;
    updated: boolean;
};

function ensureTrailingNewline(text: string): string {
    return text.endsWith("\n") ? text : `${text}\n`;
}

export function writeIfChanged(
    filePath: string,
    content: string
): WriteIfChangedResult {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    const next = ensureTrailingNewline(content);
    const exists = fs.existsSync(filePath);
    const current = exists ? fs.readFileSync(filePath, "utf8") : "";

    if (current === next) {
        return {
            changed: false,
            created: false,
            updated: false,
        };
    }

    fs.writeFileSync(filePath, next, "utf8");

    return {
        changed: true,
        created: !exists,
        updated: exists,
    };
}
