// src/data/builder/core/schemaRuntime/readValue.ts

import { cellToString, norm, normKey } from "../spreadsheet";
import type { BuildOpts } from "./types";

export function readValue(
    opts: BuildOpts,
    field: string,
    prefix = ""
): string {
    const row = opts.rowIndex.get(normKey(`${prefix}${field}`));
    if (!row) return "";

    return norm(cellToString(opts.ws.getCell(row, opts.col).value));
}