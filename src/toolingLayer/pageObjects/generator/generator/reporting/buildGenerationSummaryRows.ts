// src/toolingLayer/pageObjects/generator/generator/reporting/buildGenerationSummaryRows.ts

export function buildGenerationSummaryRows(params: {
    pagesScanned: number;
    pagesProcessed: number;
    pagesChanged: number;
    filesGenerated: number;
    registryUpdates: number;
    invalidPages: number;
    errorPages: number;
    warnings: number;
    errors: number;
    exitCode: number;
}): Array<[string, string | number]> {
    return [
        ["Pages scanned", params.pagesScanned],
        ["Pages processed", params.pagesProcessed],
        ["Pages changed", params.pagesChanged],
        ["Files generated", params.filesGenerated],
        ["Registry updates", params.registryUpdates],
        ["Invalid pages", params.invalidPages],
        ["Failed pages", params.errorPages],
        ["Warnings", params.warnings],
        ["Errors", params.errors],
        ["Exit code", params.exitCode],
    ];
}
