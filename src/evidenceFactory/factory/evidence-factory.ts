// src/evidenceFactory/factory/evidence-factory.ts

import path from 'path';
import { JsonWriter } from '../writers/json/json-writer';
import { XmlWriter } from '../writers/xml/xml-writer';
import { CsvWriter } from '../writers/csv/csv-writer';
import { ConsoleWriter } from '../writers/console/console-writer';
import { ExcelWriter } from '../writers/excel/excel-writer';
import { NdjsonStore } from '../manifest/ndjson-store';
import { OutputRouter } from '../routing/output-router';
import { nowIso } from '../utils/time-utils';
import { normalizeStatus } from '../utils/status-utils';
import type {
  EvidenceFactoryOptions,
  EvidenceWriteRequest,
  EvidenceWriteResponse,
  FinalizeExecutionRequest,
  FinalizeExecutionResponse,
  ManifestEvent,
  ManifestSummaryEvent,
} from '../contracts/types';

export class EvidenceFactory {
  private readonly jsonWriter = new JsonWriter();
  private readonly xmlWriter = new XmlWriter();
  private readonly csvWriter = new CsvWriter();
  private readonly consoleWriter = new ConsoleWriter();
  private readonly excelWriter = new ExcelWriter();
  private readonly store = new NdjsonStore();
  private readonly router: OutputRouter;

  constructor(options: EvidenceFactoryOptions = {}) {
    const rootDir = options.rootDir
      ? path.resolve(options.rootDir)
      : path.join(process.cwd(), 'artifacts');

    this.router = new OutputRouter(rootDir);
  }

  async writeEvidence(request: EvidenceWriteRequest): Promise<EvidenceWriteResponse> {
    if (request.entryType === 'summary') {
      const event: ManifestSummaryEvent = {
        eventType: 'summary',
        executionId: request.executionId,
        suiteName: request.suiteName,
        metaPayload: request.metaPayload,
        outputFormats: request.outputFormats,
        createdAt: nowIso(),
      };

      await this.store.append(
        this.router.eventFilePath(request.suiteName, request.executionId),
        event,
      );

      return {
        executionId: request.executionId,
        entryType: 'summary',
        generatedAt: nowIso(),
        artifacts: [],
      };
    }

    const normalizedStatus = normalizeStatus(request.status);

    const artifacts = await Promise.all(
      request.outputFormats
        .filter((f) => f !== 'excel')
        .map(async (format) => {
          if (format === 'console') {
            return this.consoleWriter.write(request.payload, request.consoleMode);
          }

          const filePath = this.router.evidenceFilePath({
            suiteName: request.suiteName,
            executionId: request.executionId,
            artifactId: request.artifactId,
            artifactName: request.artifactName,
            status: normalizedStatus,
            format,
            payload: request.payload,
          });

          if (format === 'json') {
            return this.jsonWriter.write(filePath, normalizedStatus, request.payload);
          }

          if (format === 'xml') {
            return this.xmlWriter.write(filePath, normalizedStatus, request.payload);
          }

          if (format === 'csv') {
            return this.csvWriter.write(filePath, normalizedStatus, request.payload);
          }

          throw new Error(`Unsupported format: ${format}`);
        }),
    );

    const event: ManifestEvent = {
      eventType: 'item',
      executionId: request.executionId,
      suiteName: request.suiteName,
      artifactId: request.artifactId,
      artifactName: request.artifactName,
      status: normalizedStatus,
      consoleMode: request.consoleMode,
      payload: request.payload,
      artifacts: {
        jsonPath: artifacts.find((a) => a.format === 'json')?.relativePath,
        xmlPath: artifacts.find((a) => a.format === 'xml')?.relativePath,
        csvPath: artifacts.find((a) => a.format === 'csv')?.relativePath,
      },
      createdAt: nowIso(),
    };

    await this.store.append(
      this.router.eventFilePath(request.suiteName, request.executionId),
      event,
    );

    return {
      executionId: request.executionId,
      entryType: 'item',
      artifactId: request.artifactId,
      status: normalizedStatus,
      generatedAt: nowIso(),
      artifacts,
    };
  }

  async finalizeExecution(
    request: FinalizeExecutionRequest,
  ): Promise<FinalizeExecutionResponse> {
    const eventPath = this.router.eventFilePath(request.suiteName, request.executionId);
    const events = (await this.store.readAll(eventPath)) as ManifestEvent[];

    const summary = events
      .filter((e): e is ManifestSummaryEvent => e.eventType === 'summary')
      .pop();

    let excel;

    if (summary?.outputFormats.includes('excel')) {
      excel = await this.excelWriter.write(
        this.router.excelPath(request.suiteName, request.executionId, {}),
        request,
        events,
      );
    }

    return {
      executionId: request.executionId,
      suiteName: request.suiteName,
      generatedAt: nowIso(),
      excel,
      eventCount: events.length,
    };
  }
}