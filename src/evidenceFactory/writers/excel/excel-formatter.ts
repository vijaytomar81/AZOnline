// src/evidenceFactory/writers/excel/excel-formatter.ts
import ExcelJS from 'exceljs';
import {
  EXCEL_COLORS,
  getExecutionHeaderColor,
  getExecutionRowFillColor,
  getResultValueColor,
} from './excel-colors';

type SummaryRow = {
  label: string;
  value: string | number | boolean;
  key: string;
};

export type SummarySection = {
  title: string;
  rows: SummaryRow[];
};

function measureCell(value: unknown): number {
  return String(value ?? '').length;
}

function applyBorders(cell: ExcelJS.Cell, borderColor: string): void {
  cell.border = {
    top: { style: 'thin', color: { argb: borderColor } },
    left: { style: 'thin', color: { argb: borderColor } },
    bottom: { style: 'thin', color: { argb: borderColor } },
    right: { style: 'thin', color: { argb: borderColor } },
  };
}

export function autoFitExecutionSheetColumns(
  worksheet: ExcelJS.Worksheet,
  options: { minWidth?: number; maxWidth?: number } = {},
): void {
  const minWidth = options.minWidth ?? 12;
  const maxWidth = options.maxWidth ?? 48;

  worksheet.columns.forEach((column) => {
    if (!column || typeof column.eachCell !== 'function') {
      return;
    }

    let width = minWidth;
    column.eachCell({ includeEmpty: true }, (cell) => {
      width = Math.max(width, measureCell(cell.value) + 2);
    });
    column.width = Math.min(width, maxWidth);
  });
}

export function styleExecutionSheet(
  worksheet: ExcelJS.Worksheet,
  sheetName: string,
): void {
  const headerColor = getExecutionHeaderColor(sheetName);
  const rowFillColor = getExecutionRowFillColor(sheetName);
  const headerRow = worksheet.getRow(1);

  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: EXCEL_COLORS.text.white } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: headerColor } };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    applyBorders(cell, EXCEL_COLORS.borders.default);
  });

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) {
      return;
    }

    row.eachCell((cell) => {
      if (rowFillColor) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: rowFillColor },
        };
      }
      cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
      applyBorders(cell, EXCEL_COLORS.borders.default);
    });
  });

  worksheet.views = [{ state: 'frozen', ySplit: 1 }];

  if (headerRow.cellCount > 0) {
    worksheet.autoFilter = {
      from: 'A1',
      to: headerRow.getCell(headerRow.cellCount).address,
    };
  }

  autoFitExecutionSheetColumns(worksheet);
}

export function styleSummarySheet(
  worksheet: ExcelJS.Worksheet,
  sections: SummarySection[],
): void {
  worksheet.mergeCells('A2:B2');
  const titleCell = worksheet.getCell('A2');
  titleCell.value = 'Execution Summary';
  titleCell.font = { bold: true, size: 16, color: { argb: EXCEL_COLORS.text.white } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: EXCEL_COLORS.headers.summaryTitle },
  };
  applyBorders(titleCell, EXCEL_COLORS.borders.summary);

  let rowNumber = 4;

  for (const section of sections) {
    worksheet.mergeCells(`A${rowNumber}:B${rowNumber}`);
    const sectionCell = worksheet.getCell(`A${rowNumber}`);
    sectionCell.value = section.title;
    sectionCell.font = { bold: true, size: 11, color: { argb: EXCEL_COLORS.text.white } };
    sectionCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: EXCEL_COLORS.headers.summarySection },
    };
    sectionCell.alignment = { horizontal: 'left', vertical: 'middle' };
    applyBorders(sectionCell, EXCEL_COLORS.borders.summary);

    rowNumber += 1;

    for (const row of section.rows) {
      const labelCell = worksheet.getCell(`A${rowNumber}`);
      const valueCell = worksheet.getCell(`B${rowNumber}`);

      labelCell.value = row.label;
      labelCell.font = { bold: true };
      labelCell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };

      valueCell.value = row.value;
      valueCell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };

      const resultColor = section.title === 'Results' ? getResultValueColor(row.key) : undefined;
      if (resultColor) {
        valueCell.font = { bold: true, color: { argb: resultColor } };
      }

      applyBorders(labelCell, EXCEL_COLORS.borders.summary);
      applyBorders(valueCell, EXCEL_COLORS.borders.summary);

      rowNumber += 1;
    }

    rowNumber += 1;
  }

  worksheet.views = [{ state: 'frozen', ySplit: 2 }];
  worksheet.columns = [{ width: 28 }, { width: 70 }];
  autoFitExecutionSheetColumns(worksheet, { minWidth: 18, maxWidth: 70 });
}