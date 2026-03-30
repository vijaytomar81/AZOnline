// src/dataLayer/data-definitions/buildAvailableSheetMappingsText.ts

import { listSheetAliases } from "./listSheetAliases";

export function buildAvailableSheetMappingsText(): string {
    const availableSheetsList = listSheetAliases();

    const maxSheetLength = Math.max(
        ...availableSheetsList.map((item) => item.sheet.length),
        "Sheet Name (Excel)".length
    );

    const header =
        `  Sheet Name (Excel)` +
        `${" ".repeat(maxSheetLength - "Sheet Name (Excel)".length)}  -> Schema Name (System)`;

    const divider = `  ${"-".repeat(header.trim().length)}`;

    return [
        header,
        divider,
        "",
        ...availableSheetsList.map((item) => {
            const paddedSheet = item.sheet.padEnd(maxSheetLength, " ");
            return `  - ${paddedSheet}  -> ${item.schema}`;
        }),
    ].join("\n");
}