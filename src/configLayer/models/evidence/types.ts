// src/configLayer/models/evidence/types.ts

export type EvidenceValueType =
    | "string"
    | "number"
    | "boolean"
    | "json";

export type EvidenceReportSection =
    | "Run"
    | "Timing"
    | "Results"
    | "Runtime"
    | "Browser"
    | "System Metadata"
    | "Other Info";

export type EvidenceFieldDefinition = {
    field: string;   // internal identifier (unique)
    key: string;     // actual path in data (e.g. "scenarioId", "runtimeInfo.browser.headless")
    label: string;   // display label (console / excel)
    valueType: EvidenceValueType;
    allowedValues?: readonly string[];
};

export type EvidenceViewFieldDefinition = EvidenceFieldDefinition & {
    toStructuredOutput?: boolean;
    toReportOutput?: boolean;
};

export type MetaEvidenceViewField = EvidenceViewFieldDefinition & {
    section?: EvidenceReportSection;
};