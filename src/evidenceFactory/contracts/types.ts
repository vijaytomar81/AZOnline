// src/evidenceFactory/contracts/types.ts

import {
  EXECUTION_MODES,
  type ExecutionMode,
} from '@configLayer/core/executionModes';

// =========================
// Output formats
// =========================
export const EVIDENCE_OUTPUT_FORMAT = {
  JSON: 'json',
  XML: 'xml',
  CSV: 'csv',
  CONSOLE: 'console',
  EXCEL: 'excel',
} as const;

export type EvidenceOutputFormat =
  (typeof EVIDENCE_OUTPUT_FORMAT)[keyof typeof EVIDENCE_OUTPUT_FORMAT];

// =========================
// Entry / event types
// =========================
export const EVIDENCE_ENTRY_TYPE = {
  ITEM: 'item',
  SUMMARY: 'summary',
} as const;

export type EvidenceEntryType =
  (typeof EVIDENCE_ENTRY_TYPE)[keyof typeof EVIDENCE_ENTRY_TYPE];

export const EVIDENCE_EVENT_TYPE = {
  ITEM: 'item',
  SUMMARY: 'summary',
} as const;

export type EvidenceEventType =
  (typeof EVIDENCE_EVENT_TYPE)[keyof typeof EVIDENCE_EVENT_TYPE];

// =========================
// Console modes
// =========================
export const EVIDENCE_CONSOLE_MODE = {
  DATA: EXECUTION_MODES.DATA,
  E2E: EXECUTION_MODES.E2E,
} as const;

export type EvidenceConsoleMode = ExecutionMode;

// =========================
// File naming timestamp source
// =========================
export const EVIDENCE_TIMESTAMP_SOURCE = {
  NOW: 'now',
  PAYLOAD: 'payload',
} as const;

export type EvidenceTimestampSource =
  (typeof EVIDENCE_TIMESTAMP_SOURCE)[keyof typeof EVIDENCE_TIMESTAMP_SOURCE];

// =========================
// Requests
// =========================
export type EvidenceWriteBaseRequest = {
  executionId: string;
  suiteName: string;
  workerId?: string;
  outputFormats: [EvidenceOutputFormat, ...EvidenceOutputFormat[]];
};

export type EvidenceWriteItemRequest = EvidenceWriteBaseRequest & {
  entryType: typeof EVIDENCE_ENTRY_TYPE.ITEM;
  artifactId: string;
  artifactName?: string;
  status: string;
  payload: Record<string, unknown>;
  consoleMode?: EvidenceConsoleMode | string;
};

export type EvidenceWriteSummaryRequest = EvidenceWriteBaseRequest & {
  entryType: typeof EVIDENCE_ENTRY_TYPE.SUMMARY;
  metaPayload: Record<string, unknown>;
};

export type EvidenceWriteRequest =
  | EvidenceWriteItemRequest
  | EvidenceWriteSummaryRequest;

export type FinalizeExecutionRequest = {
  executionId: string;
  suiteName: string;
};

// =========================
// Responses
// =========================
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
  entryType: EvidenceEntryType;
  artifactId?: string;
  status?: string;
  generatedAt: string;
  executionRootPath: string;
  executionRootRelativePath: string;
  archiveRootPath: string;
  archiveRootRelativePath: string;
  artifacts: ArtifactMetadata[];
};

export type FinalizeExecutionResponse = {
  executionId: string;
  suiteName: string;
  generatedAt: string;
  executionRootPath: string;
  executionRootRelativePath: string;
  archiveRootPath: string;
  archiveRootRelativePath: string;
  artifacts: ArtifactMetadata[];
  eventCount: number;
};

export type ArchiveExecutionEntry = {
  suiteName: string;
  executionId: string;
  archivedPath: string;
  archivedRelativePath: string;
  zipped: boolean;
};

export type ArchiveExecutionsResponse = {
  archivedCount: number;
  archivedExecutions: ArchiveExecutionEntry[];
  message: string;
};

// =========================
// Manifest events
// =========================
export type ManifestItemEvent = {
  eventType: typeof EVIDENCE_EVENT_TYPE.ITEM;
  executionId: string;
  suiteName: string;
  workerId: string;
  artifactId: string;
  artifactName?: string;
  status: string;
  consoleMode?: EvidenceConsoleMode | string;
  outputFormats: [EvidenceOutputFormat, ...EvidenceOutputFormat[]];
  payload: Record<string, unknown>;
  createdAt: string;
};

export type ManifestSummaryEvent = {
  eventType: typeof EVIDENCE_EVENT_TYPE.SUMMARY;
  executionId: string;
  suiteName: string;
  workerId: string;
  metaPayload: Record<string, unknown>;
  outputFormats: [EvidenceOutputFormat, ...EvidenceOutputFormat[]];
  createdAt: string;
};

export type ManifestEvent = ManifestItemEvent | ManifestSummaryEvent;

// =========================
// Factory options
// =========================
export type EvidenceFactoryOptions = {
  rootDir?: string;
  archive?: {
    olderThanDays?: number;
    zip?: boolean;
    maxCurrentExecutionsPerSuite?: number;
  };
  fileNaming?: {
    includeTimestamp?: boolean;
    timestampSource?: EvidenceTimestampSource;
  };
};

export type ArchiveExecutionsRequest = {
  olderThanDays?: number;
  zip?: boolean;
  maxCurrentExecutionsPerSuite?: number;
};