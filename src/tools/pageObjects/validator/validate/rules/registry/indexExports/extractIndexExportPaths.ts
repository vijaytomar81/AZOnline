// src/tools/pageObjects/validator/validate/rules/registry/indexExports/extractIndexExportPaths.ts

export function extractIndexExportPaths(tsText: string): Set<string> {
    const paths = new Set<string>();
    const re = /export\s+\*\s+from\s+"([^"]+)";/g;

    let match: RegExpExecArray | null;
    while ((match = re.exec(tsText))) {
        if (match[1]) {
            paths.add(match[1]);
        }
    }

    return paths;
}
