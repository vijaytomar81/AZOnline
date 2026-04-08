// src/evidenceLayer/contracts/EvidenceStore.ts

import type { EvidenceEntry } from "./EvidenceEntry";
import type { EvidenceLabel } from "./EvidenceLabel";
import type { EvidenceValue } from "./EvidenceValue";

export interface EvidenceStore {
    set(label: EvidenceLabel, value: EvidenceValue): void;

    get<T = EvidenceValue>(label: EvidenceLabel): T | undefined;

    has(label: EvidenceLabel): boolean;

    remove(label: EvidenceLabel): void;

    clear(): void;

    list(): EvidenceEntry[];

    snapshot(): Record<string, EvidenceValue>;
}