// src/evidenceFactory/writers/excel/excel-colors.ts
export const EXCEL_COLORS = {
    text: {
        white: 'FFFFFFFF',
    },
    borders: {
        default: 'FFE0E0E0',
        summary: 'FFD0D0D0',
    },
    headers: {
        summaryTitle: '1F4E78',
        summarySection: '5B7DB1',
        passed: '2E7D32',
        failed: 'C62828',
        error: '8E2430',
        notExecuted: 'EF6C00',
        default: '4F81BD',
    },
    fills: {
        passed: 'EAF6EC',
        failed: 'FCECEC',
        error: 'F9EAEA',
        notExecuted: 'FFF3E8',
    },
    results: {
        passed: '2E7D32',
        failed: 'C62828',
        error: '8E2430',
        notExecuted: 'EF6C00',
    },
} as const;

export function getExecutionHeaderColor(sheetName: string): string {
    switch (sheetName) {
        case 'Passed':
            return EXCEL_COLORS.headers.passed;
        case 'Failed':
            return EXCEL_COLORS.headers.failed;
        case 'Error':
            return EXCEL_COLORS.headers.error;
        case 'Not Executed':
            return EXCEL_COLORS.headers.notExecuted;
        default:
            return EXCEL_COLORS.headers.default;
    }
}

export function getExecutionRowFillColor(sheetName: string): string | undefined {
    switch (sheetName) {
        case 'Passed':
            return EXCEL_COLORS.fills.passed;
        case 'Failed':
            return EXCEL_COLORS.fills.failed;
        case 'Error':
            return EXCEL_COLORS.fills.error;
        case 'Not Executed':
            return EXCEL_COLORS.fills.notExecuted;
        default:
            return undefined;
    }
}

export function getResultValueColor(key: string): string | undefined {
    switch (key) {
        case 'passedCount':
        case 'passedItems':
            return EXCEL_COLORS.results.passed;

        case 'failedCount':
        case 'failedItems':
            return EXCEL_COLORS.results.failed;

        case 'errorCount':
        case 'errorItems':
            return EXCEL_COLORS.results.error;

        case 'notExecutedCount':
        case 'notExecutedItems':
            return EXCEL_COLORS.results.notExecuted;

        default:
            return undefined;
    }
}