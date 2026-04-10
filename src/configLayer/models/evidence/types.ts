// src/configLayer/models/evidence/types.ts

export type EvidenceValueType =
    | "string"
    | "number"
    | "boolean"
    | "json";

export type EvidenceFieldDefinition = {
    field: string;   // internal identifier (unique)
    key: string;     // actual path in data (e.g. "scenarioId", "runtimeInfo.browser.headless")
    label: string;   // display label (console / excel)
    valueType: EvidenceValueType;
    allowedValues?: readonly string[];
};
