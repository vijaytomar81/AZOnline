// src/evidenceFactory/contracts/types.ts

export type EvidenceOutputFormat = 'json' | 'xml' | 'csv' | 'console' | 'excel';

export type EvidenceWriteBaseRequest = {
  executionId: string;
  suiteName: string;
  workerId?: string;
  outputFormats: [EvidenceOutputFormat, ...EvidenceOutputFormat[]];
};

export type EvidenceWriteItemRequest = EvidenceWriteBaseRequest & {
  entryType: 'item';
  artifactId: string;
  artifactName?: string;
  status: string;
  payload: Record<string, unknown>;
  consoleMode?: 'data' | 'e2e' | string;
};

export type EvidenceWriteSummaryRequest = EvidenceWriteBaseRequest & {
  entryType: 'summary';
  metaPayload: Record<string, unknown>;
};

export type EvidenceWriteRequest = EvidenceWriteItemRequest | EvidenceWriteSummaryRequest;

export type FinalizeExecutionRequest = {
  executionId: string;
  suiteName: string;
};

export type ArtifactMetadata = {
  format: EvidenceOutputFormat;
  fileName?: string;
  filePath?: string;
  relativePath?: string;
  sizeBytes?: number;
  createdAt: string;
};

export type EvidenceWriteResponse = {
  executionId: string;
  entryType: 'item' | 'summary';
  artifactId?: string;
  status?: string;
  generatedAt: string;
  artifacts: ArtifactMetadata[];
};

export type FinalizeExecutionResponse = {
  executionId: string;
  suiteName: string;
  generatedAt: string;
  artifacts: ArtifactMetadata[];
  eventCount: number;
};

export type ManifestItemEvent = {
  eventType: 'item';
  executionId: string;
  suiteName: string;
  workerId: string;
  artifactId: string;
  artifactName?: string;
  status: string;
  consoleMode?: string;
  outputFormats: [EvidenceOutputFormat, ...EvidenceOutputFormat[]];
  payload: Record<string, unknown>;
  createdAt: string;
};

export type ManifestSummaryEvent = {
  eventType: 'summary';
  executionId: string;
  suiteName: string;
  workerId: string;
  metaPayload: Record<string, unknown>;
  outputFormats: [EvidenceOutputFormat, ...EvidenceOutputFormat[]];
  createdAt: string;
};

export type ManifestEvent = ManifestItemEvent | ManifestSummaryEvent;

export type EvidenceFactoryOptions = {
  rootDir?: string;
  archive?: {
    olderThanDays?: number;
    zip?: boolean;
    maxCurrentExecutionsPerSuite?: number;
  };
  fileNaming?: {
    includeTimestamp?: boolean;
    timestampSource?: 'now' | 'payload';
  };
};

export type ArchiveExecutionsRequest = {
  olderThanDays?: number;
  zip?: boolean;
  maxCurrentExecutionsPerSuite?: number;
};