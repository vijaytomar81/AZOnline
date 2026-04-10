// src/evidenceFactory/contracts/types.ts
export type EvidenceOutputFormat = 'json' | 'xml' | 'csv' | 'console';

export type EvidenceWriteRequest = {
  executionId: string;
  suiteName: string;
  artifactId: string;
  artifactName?: string;
  status: string;
  outputFormats: EvidenceOutputFormat[];
  payload: Record<string, unknown>;
  consoleMode?: 'data' | 'e2e' | string;
};

export type FinalizeExecutionRequest = {
  executionId: string;
  suiteName: string;
  metaPayload: Record<string, unknown>;
};

export type ArtifactMetadata = {
  format: string;
  fileName?: string;
  filePath?: string;
  relativePath?: string;
  sizeBytes?: number;
  createdAt: string;
};

export type EvidenceWriteResponse = {
  executionId: string;
  artifactId: string;
  status: string;
  generatedAt: string;
  artifacts: ArtifactMetadata[];
};

export type FinalizeExecutionResponse = {
  executionId: string;
  suiteName: string;
  generatedAt: string;
  excel: ArtifactMetadata;
  eventCount: number;
};

export type ManifestEvent = {
  executionId: string;
  suiteName: string;
  artifactId: string;
  artifactName?: string;
  status: string;
  consoleMode?: string;
  payload: Record<string, unknown>;
  artifacts: {
    jsonPath?: string;
    xmlPath?: string;
    csvPath?: string;
  };
  createdAt: string;
};

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
