// src/execution/runtime/scenarioSheet/workbook/loadWorkbookAndWorksheet.ts

import type { LoadedWorksheet } from "./types";
import { readWorkbook } from "./readWorkbook";
import { resolveWorksheet } from "./resolveWorksheet";

export async function loadWorkbookAndWorksheet(args: {
    absExcel: string;
    requestedSheetName: string;
}): Promise<LoadedWorksheet> {
    const workbook = await readWorkbook(args.absExcel);
    const worksheet = resolveWorksheet(workbook, args.requestedSheetName);

    return { workbook, worksheet };
}
