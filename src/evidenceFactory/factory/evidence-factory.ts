// src/evidenceFactory/factory/evidence-factory.ts
import { JsonWriter } from '../writers/json/json-writer';
import { XmlWriter } from '../writers/xml/xml-writer';
import { CsvWriter } from '../writers/csv/csv-writer';
import { ConsoleWriter } from '../writers/console/console-writer';
import { ExcelWriter } from '../writers/excel/excel-writer';
import { NdjsonStore } from '../manifest/ndjson-store';
import { OutputRouter } from '../routing/output-router';
import { ArchiveService } from '../archiving/archive-service';
import { nowIso } from '../utils/time-utils';
import { normalizeStatus } from '../utils/status-utils';
import type {
  EvidenceWriteRequest,
  EvidenceWriteResponse,
  FinalizeExecutionRequest,
  FinalizeExecutionResponse,
  ManifestEvent,
} from '../contracts/types';

export class EvidenceFactory {
  private readonly jsonWriter = new JsonWriter();
  private readonly xmlWriter = new XmlWriter();
  private readonly csvWriter = new CsvWriter();
  private readonly consoleWriter = new ConsoleWriter();
  private readonly excelWriter = new ExcelWriter();
  private readonly store = new NdjsonStore();
  private readonly router = new OutputRouter();
  private readonly archiveService = new ArchiveService();

  async writeEvidence(request: EvidenceWriteRequest): Promise<EvidenceWriteResponse> {
    const normalizedStatus = normalizeStatus(request.status);

    const artifacts = await Promise.all(
      request.outputFormats.map(async (format) => {
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
        });

        if (format === 'json') {
          return this.jsonWriter.write(filePath, normalizedStatus, request.payload);
        }

        if (format === 'xml') {
          return this.xmlWriter.write(filePath, normalizedStatus, request.payload);
        }

        return this.csvWriter.write(filePath, normalizedStatus, request.payload);
      }),
    );

    const event: ManifestEvent = {
      executionId: request.executionId,
      suiteName: request.suiteName,
      artifactId: request.artifactId,
      artifactName: request.artifactName,
      status: normalizedStatus,
      consoleMode: request.consoleMode,
      payload: request.payload,
      artifacts: {
        jsonPath: artifacts.find((artifact) => artifact.format === 'json')?.relativePath,
        xmlPath: artifacts.find((artifact) => artifact.format === 'xml')?.relativePath,
        csvPath: artifacts.find((artifact) => artifact.format === 'csv')?.relativePath,
      },
      createdAt: nowIso(),
    };

    await this.store.append(this.router.eventFilePath(request.suiteName, request.executionId), event);

    return {
      executionId: request.executionId,
      artifactId: request.artifactId,
      status: normalizedStatus,
      generatedAt: nowIso(),
      artifacts,
    };
  }

  async finalizeExecution(request: FinalizeExecutionRequest): Promise<FinalizeExecutionResponse> {
    const eventPath = this.router.eventFilePath(request.suiteName, request.executionId);
    const events = await this.store.readAll(eventPath);

    const excel = await this.excelWriter.write(
      this.router.excelPath(request.suiteName, request.executionId),
      request,
      events,
    );

    return {
      executionId: request.executionId,
      suiteName: request.suiteName,
      generatedAt: nowIso(),
      excel,
      eventCount: events.length,
    };
  }

  async archiveOldExecutions(args: { olderThanDays: number }): Promise<{ archivedCount: number }> {
    return this.archiveService.archiveOldExecutions(args);
  }
}
