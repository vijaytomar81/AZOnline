// src/evidence/core/InMemoryEvidenceStore.ts

import type { EvidenceEntry } from "../contracts/EvidenceEntry";
import type { EvidenceLabel } from "../contracts/EvidenceLabel";
import type { EvidenceStore } from "../contracts/EvidenceStore";
import type { EvidenceValue } from "../contracts/EvidenceValue";

/**
 * In-memory implementation of EvidenceStore
 * - no side effects
 * - no logging
 * - no framework coupling
 */
export class InMemoryEvidenceStore implements EvidenceStore {
    private readonly store = new Map<EvidenceLabel, EvidenceValue>();

    set(label: EvidenceLabel, value: EvidenceValue): void {
        this.store.set(label, value);
    }

    get<T = EvidenceValue>(label: EvidenceLabel): T | undefined {
        return this.store.get(label) as T | undefined;
    }

    has(label: EvidenceLabel): boolean {
        return this.store.has(label);
    }

    remove(label: EvidenceLabel): void {
        this.store.delete(label);
    }

    clear(): void {
        this.store.clear();
    }

    list(): EvidenceEntry[] {
        return Array.from(this.store.entries()).map(([label, value]) => ({
            label,
            value,
        }));
    }

    snapshot(): Record<string, EvidenceValue> {
        const result: Record<string, EvidenceValue> = {};

        for (const [label, value] of this.store.entries()) {
            result[String(label)] = value;
        }

        return result;
    }
}