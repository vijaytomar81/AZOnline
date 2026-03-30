// src/utils/fileFormats/excel.ts

import ExcelJS from "exceljs";

export async function readWorkbook(
    filePath: string
): Promise<ExcelJS.Workbook> {
    const workbook = new ExcelJS.Workbook();

    try {
        await workbook.xlsx.readFile(filePath);
        return workbook;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to read Excel file: ${filePath}\n${message}`);
    }
}

export function getWorksheet(
    workbook: ExcelJS.Workbook,
    sheetName: string
): ExcelJS.Worksheet {
    const sheet = workbook.getWorksheet(sheetName);

    if (!sheet) {
        const available = workbook.worksheets.map((item) => item.name).join(", ");
        throw new Error(
            `Sheet "${sheetName}" not found. Available: ${available}`
        );
    }

    return sheet;
}

export function readWorksheetRows(
    worksheet: ExcelJS.Worksheet
): string[][] {
    const rows: string[][] = [];

    worksheet.eachRow((row) => {
        const values = row.values as unknown[];

        rows.push(
            values
                .slice(1)
                .map((cell) => String(cell ?? "").trim())
        );
    });

    return rows;
}

export async function writeWorkbook(args: {
    filePath: string;
    sheets: Array<{
        name: string;
        rows: Array<Array<string | number>>;
    }>;
}): Promise<void> {
    const workbook = new ExcelJS.Workbook();

    args.sheets.forEach((sheet) => {
        const worksheet = workbook.addWorksheet(sheet.name);

        sheet.rows.forEach((row) => {
            worksheet.addRow(row);
        });
    });

    await workbook.xlsx.writeFile(args.filePath);
}
