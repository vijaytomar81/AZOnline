// src/evidenceFactory/factory/helpers/finalize-execution-artifacts.ts

import { nowIso } from '../../utils/time-utils';
import type { NdjsonStore } from '../../manifest/ndjson-store';
import type { OutputRouter } from '../../routing/output-router';
import type { JsonWriter } from '../../writers/json/json-writer';
import type { XmlWriter } from '../../writers/xml/xml-writer';
import type { CsvWriter } from '../../writers/csv/csv-writer';
import type { ConsoleWriter } from '../../writers/console/console-writer';
import type { ExcelWriter } from '../../writers/excel/excel-writer';
import type {
    ArtifactMetadata,
    FinalizeExecutionRequest,
    FinalizeExecutionResponse,
    ManifestEvent,
    ManifestItemEvent,
    ManifestSummaryEvent,
} from '../../contracts/types';

type FinalizeExecutionArtifactsArgs = {
    request: FinalizeExecutionRequest;
    store: NdjsonStore;
    router: OutputRouter;
    jsonWriter: JsonWriter;
    xmlWriter: XmlWriter;
    csvWriter: CsvWriter;
    consoleWriter: ConsoleWriter;
    excelWriter: ExcelWriter;
};

export async function finalizeExecutionArtifacts(
    args: FinalizeExecutionArtifactsArgs,
): Promise<FinalizeExecutionResponse> {
    const manifestDir = args.router.manifestDirPath(
        args.request.suiteName,
        args.request.executionId,
    );

    const events = (await args.store.readAllFromDirectory(manifestDir)) as ManifestEvent[];

    const itemEvents = events.filter(
        (event): event is ManifestItemEvent => event.eventType === 'item',
    );

    const summaryEvents = events.filter(
        (event): event is ManifestSummaryEvent => event.eventType === 'summary',
    );

    const latestSummaryByFormat = (
        format: 'json' | 'xml' | 'csv' | 'console' | 'excel',
    ): ManifestSummaryEvent | undefined =>
        summaryEvents
            .filter((event) => event.outputFormats.includes(format))
            .pop();

    const artifacts: ArtifactMetadata[] = [];

    const jsonItems = itemEvents.filter((event) => event.outputFormats.includes('json'));
    const jsonSummary = latestSummaryByFormat('json');
    if (jsonItems.length > 0 || jsonSummary) {
        artifacts.push(
            await args.jsonWriter.writeConsolidated(
                args.router.finalOutputPath({
                    suiteName: args.request.suiteName,
                    executionId: args.request.executionId,
                    format: 'json',
                    payload: jsonSummary?.metaPayload,
                }),
                jsonItems,
                jsonSummary,
            ),
        );
    }

    const xmlItems = itemEvents.filter((event) => event.outputFormats.includes('xml'));
    const xmlSummary = latestSummaryByFormat('xml');
    if (xmlItems.length > 0 || xmlSummary) {
        artifacts.push(
            await args.xmlWriter.writeConsolidated(
                args.router.finalOutputPath({
                    suiteName: args.request.suiteName,
                    executionId: args.request.executionId,
                    format: 'xml',
                    payload: xmlSummary?.metaPayload,
                }),
                xmlItems,
                xmlSummary,
            ),
        );
    }

    const csvItems = itemEvents.filter((event) => event.outputFormats.includes('csv'));
    const csvSummary = latestSummaryByFormat('csv');
    if (csvItems.length > 0 || csvSummary) {
        artifacts.push(
            await args.csvWriter.writeConsolidated(
                args.router.finalOutputPath({
                    suiteName: args.request.suiteName,
                    executionId: args.request.executionId,
                    format: 'csv',
                    payload: csvSummary?.metaPayload,
                }),
                csvItems,
                csvSummary,
            ),
        );
    }

    const consoleItems = itemEvents.filter((event) => event.outputFormats.includes('console'));
    const consoleSummary = latestSummaryByFormat('console');
    if (consoleItems.length > 0 || consoleSummary) {
        artifacts.push(
            await args.consoleWriter.writeConsolidated(
                args.router.finalOutputPath({
                    suiteName: args.request.suiteName,
                    executionId: args.request.executionId,
                    format: 'console',
                    payload: consoleSummary?.metaPayload,
                }),
                consoleItems,
                consoleSummary,
            ),
        );
    }

    const excelItems = itemEvents.filter((event) => event.outputFormats.includes('excel'));
    const excelSummary = latestSummaryByFormat('excel');
    if (excelItems.length > 0 || excelSummary) {
        artifacts.push(
            await args.excelWriter.writeConsolidated(
                args.router.finalOutputPath({
                    suiteName: args.request.suiteName,
                    executionId: args.request.executionId,
                    format: 'excel',
                    payload: excelSummary?.metaPayload,
                }),
                excelItems,
                excelSummary,
            ),
        );
    }

    return {
        executionId: args.request.executionId,
        suiteName: args.request.suiteName,
        generatedAt: nowIso(),
        artifacts,
        eventCount: events.length,
    };
}