// src/evidenceFactory/factory/helpers/finalize-execution-artifacts.ts

import { nowIso } from '../../utils/time-utils';
import type { NdjsonStore } from '../../manifest/ndjson-store';
import type { OutputRouter } from '../../routing/output-router';
import type { JsonWriter } from '../../writers/json/json-writer';
import type { XmlWriter } from '../../writers/xml/xml-writer';
import type { CsvWriter } from '../../writers/csv/csv-writer';
import type { ConsoleWriter } from '../../writers/console/console-writer';
import type { ExcelWriter } from '../../writers/excel/excel-writer';
import {
  EVIDENCE_ENTRY_TYPE,
  EVIDENCE_EVENT_TYPE,
  EVIDENCE_OUTPUT_FORMAT,
  type ArtifactMetadata,
  type EvidenceOutputFormat,
  type FinalizeExecutionRequest,
  type FinalizeExecutionResponse,
  type ManifestEvent,
  type ManifestItemEvent,
  type ManifestSummaryEvent,
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
    (event): event is ManifestItemEvent =>
      event.eventType === EVIDENCE_EVENT_TYPE.ITEM,
  );

  const summaryEvents = events.filter(
    (event): event is ManifestSummaryEvent =>
      event.eventType === EVIDENCE_EVENT_TYPE.SUMMARY,
  );

  const latestSummaryByFormat = (
    format: EvidenceOutputFormat,
  ): ManifestSummaryEvent | undefined =>
    summaryEvents
      .filter((event) => event.outputFormats.includes(format))
      .pop();

  const artifacts: ArtifactMetadata[] = [];

  const jsonItems = itemEvents.filter((event) =>
    event.outputFormats.includes(EVIDENCE_OUTPUT_FORMAT.JSON),
  );
  const jsonSummary = latestSummaryByFormat(EVIDENCE_OUTPUT_FORMAT.JSON);
  if (jsonItems.length > 0 || jsonSummary) {
    artifacts.push(
      await args.jsonWriter.writeConsolidated(
        args.router.finalOutputPath({
          suiteName: args.request.suiteName,
          executionId: args.request.executionId,
          format: EVIDENCE_OUTPUT_FORMAT.JSON,
          payload: jsonSummary?.metaPayload,
        }),
        jsonItems,
        jsonSummary,
      ),
    );
  }

  const xmlItems = itemEvents.filter((event) =>
    event.outputFormats.includes(EVIDENCE_OUTPUT_FORMAT.XML),
  );
  const xmlSummary = latestSummaryByFormat(EVIDENCE_OUTPUT_FORMAT.XML);
  if (xmlItems.length > 0 || xmlSummary) {
    artifacts.push(
      await args.xmlWriter.writeConsolidated(
        args.router.finalOutputPath({
          suiteName: args.request.suiteName,
          executionId: args.request.executionId,
          format: EVIDENCE_OUTPUT_FORMAT.XML,
          payload: xmlSummary?.metaPayload,
        }),
        xmlItems,
        xmlSummary,
      ),
    );
  }

  const csvItems = itemEvents.filter((event) =>
    event.outputFormats.includes(EVIDENCE_OUTPUT_FORMAT.CSV),
  );
  const csvSummary = latestSummaryByFormat(EVIDENCE_OUTPUT_FORMAT.CSV);
  if (csvItems.length > 0 || csvSummary) {
    artifacts.push(
      await args.csvWriter.writeConsolidated(
        args.router.finalOutputPath({
          suiteName: args.request.suiteName,
          executionId: args.request.executionId,
          format: EVIDENCE_OUTPUT_FORMAT.CSV,
          payload: csvSummary?.metaPayload,
        }),
        csvItems,
        csvSummary,
      ),
    );
  }

  const consoleItems = itemEvents.filter((event) =>
    event.outputFormats.includes(EVIDENCE_OUTPUT_FORMAT.CONSOLE),
  );
  const consoleSummary = latestSummaryByFormat(EVIDENCE_OUTPUT_FORMAT.CONSOLE);
  if (consoleItems.length > 0 || consoleSummary) {
    artifacts.push(
      await args.consoleWriter.writeConsolidated(
        args.router.finalOutputPath({
          suiteName: args.request.suiteName,
          executionId: args.request.executionId,
          format: EVIDENCE_OUTPUT_FORMAT.CONSOLE,
          payload: consoleSummary?.metaPayload,
        }),
        consoleItems,
        consoleSummary,
      ),
    );
  }

  const excelItems = itemEvents.filter((event) =>
    event.outputFormats.includes(EVIDENCE_OUTPUT_FORMAT.EXCEL),
  );
  const excelSummary = latestSummaryByFormat(EVIDENCE_OUTPUT_FORMAT.EXCEL);
  if (excelItems.length > 0 || excelSummary) {
    artifacts.push(
      await args.excelWriter.writeConsolidated(
        args.router.finalOutputPath({
          suiteName: args.request.suiteName,
          executionId: args.request.executionId,
          format: EVIDENCE_OUTPUT_FORMAT.EXCEL,
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
