// src/data/builder/core/spreadsheet/cellValue.ts

export function cellToString(v: any): string {
    if (v === null || v === undefined) return "";

    if (typeof v === "object") {
        if ("result" in v) return cellToString((v as any).result);
        if ("text" in v) return String((v as any).text ?? "");

        if ("richText" in v && Array.isArray((v as any).richText)) {
            return (v as any).richText.map((x: any) => x.text ?? "").join("");
        }
    }

    return String(v);
}