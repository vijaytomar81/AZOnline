// src/toolingLayer/pageObjects/validator/validate/rules/registry/pageManager/extractPageManagerState.ts

export function extractPageManagerImports(tsText: string): Map<string, string> {
    const imports = new Map<string, string>();
    const re = /import\s+\{\s*([A-Za-z0-9_]+)\s*\}\s+from\s+"([^"]+)";/g;

    let match: RegExpExecArray | null;
    while ((match = re.exec(tsText))) {
        const className = match[1];
        const importPath = match[2];

        if (className && importPath?.startsWith("@businessLayer/pageObjects/objects/")) {
            imports.set(importPath, className);
        }
    }

    return imports;
}

export function extractPageManagerKeys(tsText: string): Set<string> {
    const keys = new Set<string>();
    const re = /this\.get\("([^"]+)"/g;

    let match: RegExpExecArray | null;
    while ((match = re.exec(tsText))) {
        if (match[1]) {
            keys.add(match[1]);
        }
    }

    return keys;
}