// src/evidenceFactory/contracts/types.ts
export type FieldType = 'string' | 'number' | 'boolean' | 'date';
export type OutputFormat = 'json' | 'xml' | 'csv' | 'console';
export type ExecutionStatus = 'PASSED' | 'FAILED' | 'ERROR' | 'NOT_EXECUTED';

export type FieldDefinition = {
  type: FieldType;
  required?: boolean;
  label?: string;
  masked?: boolean;
};

export type EvidenceSchema<T extends Record<string, unknown>> = {
  name: string;
  fields: { [K in keyof T]: FieldDefinition };
};

export type EvidenceWriteRequest<T extends Record<string, unknown>> = {
  executionId: string;
  suiteName: string;
  appName: string;
  insuranceType: string;
  testCaseId: string;
  testName: string;
  status: ExecutionStatus;
  startedAt: string;
  endedAt: string;
  durationMs: number;
  environment: string;
  buildNumber?: string;
  gitCommit?: string;
  correlationId?: string;
  traceId?: string;
  remarks?: string;
  failureReason?: string;
  errorMessage?: string;
  data: T;
  outputFormats: OutputFormat[];
};

export type FinalizeExecutionRequest = {
  executionId: string;
  suiteName: string;
  appName: string;
  environment: string;
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
  testCaseId: string;
  status: ExecutionStatus;
  generatedAt: string;
  artifacts: ArtifactMetadata[];
};

export type FinalizeExecutionResponse = {
  executionId: string;
  suiteName: string;
  generatedAt: string;
  summary: Record<string, number>;
  excel: ArtifactMetadata;
};

export type ManifestEvent<T extends Record<string, unknown>> = {
  executionId: string;
  suiteName: string;
  appName: string;
  environment: string;
  insuranceType: string;
  testCaseId: string;
  testName: string;
  status: ExecutionStatus;
  startedAt: string;
  endedAt: string;
  durationMs: number;
  buildNumber?: string;
  gitCommit?: string;
  correlationId?: string;
  traceId?: string;
  remarks?: string;
  failureReason?: string;
  errorMessage?: string;
  jsonPath?: string;
  xmlPath?: string;
  csvPath?: string;
  data: T;
};
