// src/evidenceFactory/factory/evidence-factory.ts

import path from 'path';
import { ExcelWriter } from '../writers/excel/excel-writer';
import { NdjsonStore } from '../manifest/ndjson-store';
import { OutputRouter } from '../routing/output-router';
import { ArchiveService } from '../archiving/archive-service';
import { nowIso } from '../utils/time-utils';
import { normalizeStatus } from '../utils/status-utils';
import type {
  ArchiveExecutionsRequest,
  EvidenceFactoryOptions,
  EvidenceWriteRequest,
  EvidenceWriteResponse,
  FinalizeExecutionRequest,
  FinalizeExecutionResponse,
  ManifestEvent,
  ManifestItemEvent,
  ManifestSummaryEvent,
} from '../contracts/types';

export class EvidenceFactory {
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

    const event: ManifestItemEvent = {
      eventType: 'item',
      executionId: request.executionId,
      suiteName: request.suiteName,
      artifactId: request.artifactId,
      artifactName: request.artifactName,
      status: normalizedStatus,
      consoleMode: request.consoleMode,
      payload: request.payload,
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
      artifacts: [],
    };
  }

  async finalizeExecution(
    request: FinalizeExecutionRequest,
  ): Promise<FinalizeExecutionResponse> {
    const eventPath = this.router.eventFilePath(request.suiteName, request.executionId);
    const events = (await this.store.readAll(eventPath)) as ManifestEvent[];

    const summary = events
      .filter((event): event is ManifestSummaryEvent => event.eventType === 'summary')
      .pop();

    if (!summary) {
      throw new Error('No summary event found. Cannot finalize execution.');
    }

    let excel: FinalizeExecutionResponse['excel'];

    if (summary.outputFormats.includes('excel')) {
      excel = await this.excelWriter.write(
        this.router.excelPath(request.suiteName, request.executionId, summary.metaPayload),
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