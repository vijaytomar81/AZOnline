// src/evidenceFactory/factory/evidence-factory.ts

import path from 'path';
import { JsonWriter } from '../writers/json/json-writer';
import { XmlWriter } from '../writers/xml/xml-writer';
import { CsvWriter } from '../writers/csv/csv-writer';
import { ConsoleWriter } from '../writers/console/console-writer';
import { ExcelWriter } from '../writers/excel/excel-writer';
import { NdjsonStore } from '../manifest/ndjson-store';
import { OutputRouter } from '../routing/output-router';
import { ArchiveService } from '../archiving/archive-service';
import { nowIso } from '../utils/time-utils';
import type {
  ArchiveExecutionsRequest,
  EvidenceFactoryOptions,
  EvidenceWriteRequest,
  EvidenceWriteResponse,
  FinalizeExecutionRequest,
  FinalizeExecutionResponse,
} from '../contracts/types';
import { buildItemManifestEvent } from './helpers/build-item-manifest-event';
import { buildSummaryManifestEvent } from './helpers/build-summary-manifest-event';
import { finalizeExecutionArtifacts } from './helpers/finalize-execution-artifacts';
import { getWorkerId } from './helpers/get-worker-id';

export class EvidenceFactory {
  private readonly jsonWriter = new JsonWriter();
  private readonly xmlWriter = new XmlWriter();
  private readonly csvWriter = new CsvWriter();
  private readonly consoleWriter = new ConsoleWriter();
  private readonly excelWriter = new ExcelWriter();
  private readonly store = new NdjsonStore();
  private readonly router: OutputRouter;
  private readonly archiveService: ArchiveService;
  private readonly options: EvidenceFactoryOptions;

  constructor(options: EvidenceFactoryOptions = {}) {
    this.options = options;

    const rootDir = options.rootDir
      ? path.resolve(options.rootDir)
      : path.join(process.cwd(), process.env.EVIDENCE_ROOT_DIR ?? 'artifacts');

    this.router = new OutputRouter(rootDir, options.fileNaming);
    this.archiveService = new ArchiveService(rootDir);
  }

  async writeEvidence(request: EvidenceWriteRequest): Promise<EvidenceWriteResponse> {
    const workerId = getWorkerId(request.workerId);

    const event =
      request.entryType === 'summary'
        ? buildSummaryManifestEvent(request, workerId)
        : buildItemManifestEvent(request, workerId);

    await this.store.append(
      this.router.eventFilePath(request.suiteName, request.executionId, workerId),
      event,
    );

    return {
      executionId: request.executionId,
      entryType: request.entryType,
      artifactId: request.entryType === 'item' ? request.artifactId : undefined,
      status: request.entryType === 'item' ? request.status : undefined,
      generatedAt: nowIso(),
      artifacts: [],
    };
  }

  async finalizeExecution(
    request: FinalizeExecutionRequest,
  ): Promise<FinalizeExecutionResponse> {
    return finalizeExecutionArtifacts({
      request,
      store: this.store,
      router: this.router,
      jsonWriter: this.jsonWriter,
      xmlWriter: this.xmlWriter,
      csvWriter: this.csvWriter,
      consoleWriter: this.consoleWriter,
      excelWriter: this.excelWriter,
    });
  }

  async archiveOldExecutions(
    args: ArchiveExecutionsRequest = {},
  ): Promise<{ archivedCount: number }> {
    return this.archiveService.archiveOldExecutions({
      olderThanDays: args.olderThanDays ?? this.options.archive?.olderThanDays,
      zip: args.zip ?? this.options.archive?.zip ?? false,
      maxCurrentExecutionsPerSuite:
        args.maxCurrentExecutionsPerSuite ?? this.options.archive?.maxCurrentExecutionsPerSuite,
    });
  }
}