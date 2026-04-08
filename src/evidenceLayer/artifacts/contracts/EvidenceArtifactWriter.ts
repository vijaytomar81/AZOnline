// src/evidenceLayer/artifacts/contracts/EvidenceArtifactWriter.ts

import type { EvidenceArtifactPaths } from "./EvidenceArtifactPaths";

export type EvidenceArtifactWriteResult = {
    paths: EvidenceArtifactPaths;
};

export interface EvidenceArtifactWriter<TInput> {
    write(input: TInput): Promise<EvidenceArtifactWriteResult>;
}