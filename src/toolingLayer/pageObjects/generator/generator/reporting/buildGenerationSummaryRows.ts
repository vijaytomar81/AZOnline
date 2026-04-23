// src/toolingLayer/pageObjects/generator/generator/reporting/buildGenerationSummaryRows.ts

export function buildGenerationSummaryRows(params: {
    availablePageMaps: number;
    createdCount: number;
    updatedCount: number;
    unchangedCount: number;
    failedCount: number;
    filesGenerated: number;
    registryPagesUpdated: number;
    invalidPages: number;
    exitCode: number;
}): Array<[string, string | number]> {
    return [
        ["Available Page Maps", params.availablePageMaps],
        ["Created", params.createdCount],
        ["Updated", params.updatedCount],
        ["Unchanged", params.unchangedCount],
        ["Failed", params.failedCount],
        ["Files generated", params.filesGenerated],
        ["Registry pages updated", params.registryPagesUpdated],
        ["Invalid pages", params.invalidPages],
        ["Exit code", params.exitCode],
    ];
}
