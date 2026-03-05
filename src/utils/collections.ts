// src/utils/collections.ts

export function uniq(arr: string[]): string[] {
    return Array.from(new Set(arr.filter(Boolean)));
}

export function uniqueKey(base: string, used: Set<string>): string {
    let key = base;
    let i = 2;
    while (!key || used.has(key)) {
        key = `${base}${i}`;
        i++;
    }
    used.add(key);
    return key;
}