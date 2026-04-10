// src/evidenceFactory/factory/evidence-factory.ts
import { JsonWriter } from '../writers/json/json-writer';
import { XmlWriter } from '../writers/xml/xml-writer';
import { CsvWriter } from '../writers/csv/csv-writer';
import { ConsoleWriter } from '../writers/console/console-writer';
import { ExcelWriter } from '../writers/excel/excel-writer';
import { NdjsonStore } from '../manifest/ndjson-store';
import { OutputRouter } from '../routing/output-router';
import { ArchiveService } from '../archiving/archive-service';
import { validateAgainstSchema } from './validator';
import { nowIso } from '../utils/time-utils';
import { EvidenceSchema, EvidenceWriteRequest, EvidenceWriteResponse, FinalizeExecutionRequest, FinalizeExecutionResponse, ManifestEvent } from '../contracts/types';

export class EvidenceFactory {
  private readonly jsonWriter = new JsonWriter();
  private readonly xmlWriter = new XmlWriter();
  private readonly csvWriter = new CsvWriter();
  private readonly consoleWriter = new ConsoleWriter();
  private readonly excelWriter = new ExcelWriter();
  private readonly store = new NdjsonStore();
  private readonly router = new OutputRouter();
  private readonly archiveService = new ArchiveService();

  async writeEvidence<T extends Record<string, unknown>>(
    schema: EvidenceSchema<T>,
    request: EvidenceWriteRequest<T>,
  ): Promise<EvidenceWriteResponse> {
    validateAgainstSchema(schema, request.data);
    const artifacts = await Promise.all(request.outputFormats.map(async (format) => {
      if (format === 'console') {
        return this.consoleWriter.write({ testCaseId: request.testCaseId, status: request.status, data: request.data });
      }
      const filePath = this.router.evidenceFilePath({ ...request, format });
      if (format === 'json') return this.jsonWriter.write(filePath, schema, request.data);
      if (format === 'xml') return this.xmlWriter.write(filePath, schema, request.data);
      return this.csvWriter.write(filePath, schema, request.data);
    }));

    const event: ManifestEvent<T> = {
      ...request,
      jsonPath: artifacts.find((a) => a.format === 'json')?.relativePath,
      xmlPath: artifacts.find((a) => a.format === 'xml')?.relativePath,
      csvPath: artifacts.find((a) => a.format === 'csv')?.relativePath,
    };
    await this.store.append(this.router.eventFilePath(request.suiteName, request.executionId), event);
    return { executionId: request.executionId, testCaseId: request.testCaseId, status: request.status, generatedAt: nowIso(), artifacts };
  }

  async finalizeExecution(request: FinalizeExecutionRequest): Promise<FinalizeExecutionResponse> {
    const eventPath = this.router.eventFilePath(request.suiteName, request.executionId);
    const events = await this.store.readAll(eventPath);
    const excel = await this.excelWriter.write(this.router.excelPath(request.suiteName, request.executionId), request, events);
    const summary = {
      total: events.length,
      passed: events.filter((e) => e.status === 'PASSED').length,
      failed: events.filter((e) => e.status === 'FAILED').length,
      error: events.filter((e) => e.status === 'ERROR').length,
      notExecuted: events.filter((e) => e.status === 'NOT_EXECUTED').length,
    };
    return { executionId: request.executionId, suiteName: request.suiteName, generatedAt: nowIso(), summary, excel };
  }

  async archiveOldExecutions(args: { olderThanDays: number }): Promise<{ archivedCount: number }> {
    return this.archiveService.archiveOldExecutions(args);
  }
}
