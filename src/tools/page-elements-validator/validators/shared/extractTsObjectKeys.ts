// src/tools/page-elements-validator/validators/shared/extractTsObjectKeys.ts

export function extractTopLevelObjectKeys(
    ts: string,
    objectName: string
): string[] {
    const re = new RegExp(
        `export\\s+const\\s+${objectName}\\s*=\\s*\\{([\\s\\S]*?)\\}\\s+as\\s+const;`,
        "m"
    );

    const m = ts.match(re);
    if (!m) return [];

    const body = m[1] ?? "";
    const keys: string[] = [];

    const keyRe = /^\s{2}([A-Za-z_$][A-Za-z0-9_$]*|"[^"]+")\s*:/gm;

    let km: RegExpExecArray | null;
    while ((km = keyRe.exec(body))) {
        let k = km[1] ?? "";
        if (k.startsWith('"') && k.endsWith('"')) k = k.slice(1, -1);
        keys.push(k);
    }

    return Array.from(new Set(keys));
}