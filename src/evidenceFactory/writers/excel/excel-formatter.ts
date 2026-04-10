// src/evidenceFactory/writers/excel/excel-formatter.ts
import ExcelJS from 'exceljs';

export class ExcelFormatter {
  styleHeader(row: ExcelJS.Row): void {
    row.font = { bold: true };
    row.alignment = { vertical: 'middle', horizontal: 'left' };

    row.eachCell((cell) => {
      cell.border = this.border();
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9EAF7' },
      };
    });
  }

  styleTable(sheet: ExcelJS.Worksheet): void {
    sheet.views = [{ state: 'frozen', ySplit: 1 }];
    sheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: Math.max(1, sheet.columnCount) },
    };

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        this.styleHeader(row);
      }

      row.eachCell((cell) => {
        cell.border = this.border();
        cell.alignment = { wrapText: true, vertical: 'top' };
      });
    });

    sheet.columns.forEach((column) => {
      if (!column || typeof column.eachCell !== 'function') {
        return;
      }

      let max = 12;

      column.eachCell({ includeEmpty: true }, (cell) => {
        max = Math.max(max, String(cell.value ?? '').length + 2);
      });

      column.width = Math.min(max, 40);
    });
  }

  private border(): Partial<ExcelJS.Borders> {
    return {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
    };
  }
}
