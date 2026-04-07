// src/evidence/artifacts/excel/styleExecutionSheet.ts

import ExcelJS from "exceljs";

function getHeaderColor(sheetName: string): string {
    switch (sheetName) {
        case "Passed":
            return "2E7D32";
        case "Failed":
            return "C62828";
        case "Not Executed":
            return "EF6C00";
        default:
            return "4F81BD";
    }
}

function getRowFillColor(sheetName: string): string | undefined {
    switch (sheetName) {
        case "Passed":
            return "EAF6EC";
        case "Failed":
            return "FCECEC";
        case "Not Executed":
            return "FFF3E8";
        default:
            return undefined;
    }
}

function applyBorders(cell: ExcelJS.Cell): void {
    cell.border = {
        top: { style: "thin", color: { argb: "FFE0E0E0" } },
        left: { style: "thin", color: { argb: "FFE0E0E0" } },
        bottom: { style: "thin", color: { argb: "FFE0E0E0" } },
        right: { style: "thin", color: { argb: "FFE0E0E0" } },
    };
}

export function styleExecutionSheet(
    worksheet: ExcelJS.Worksheet,
    sheetName: string
): void {
    const headerColor = getHeaderColor(sheetName);
    const rowFillColor = getRowFillColor(sheetName);

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
        cell.font = {
            bold: true,
            color: { argb: "FFFFFFFF" },
        };
        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: headerColor },
        };
        cell.alignment = {
            vertical: "middle",
            horizontal: "center",
            wrapText: true,
        };
        applyBorders(cell);
    });

    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) {
            return;
        }

        row.eachCell((cell) => {
            if (rowFillColor) {
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: rowFillColor },
                };
            }

            cell.alignment = {
                vertical: "top",
                horizontal: "left",
                wrapText: true,
            };
            applyBorders(cell);
        });
    });

    worksheet.views = [{ state: "frozen", ySplit: 1 }];

    if (headerRow.cellCount > 0) {
        worksheet.autoFilter = {
            from: "A1",
            to: headerRow.getCell(headerRow.cellCount).address,
        };
    }
}
