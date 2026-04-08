// src/evidenceLayer/artifacts/excel/prettifyExcelColumn.ts

const SPECIAL_CASES: Record<string, string> = {
    Id: "ID",
    Url: "URL",
    Iql: "IQL",
    Pcw: "PCW",
};

export function prettifyExcelColumn(value: string): string {
    return value
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .split(" ")
        .filter(Boolean)
        .map((part) => SPECIAL_CASES[part] ?? part)
        .join(" ");
}
