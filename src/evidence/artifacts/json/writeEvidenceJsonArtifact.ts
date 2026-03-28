// src/evidence/artifacts/json/writeEvidenceJsonArtifact.ts

import fs from "node:fs/promises";
import { buildEvidenceJson } from "./buildEvidenceJson";
import {
    buildEvidenceMetadata,
    type BuildEvidenceMetadataInput,
} from "./buildEvidenceMetadata";
import { buildEvidenceArtifactPath } from "../paths/buildEvidenceArtifactPath";
import type { EvidenceContext } from "../../runtime/EvidenceContext";
import type {
    EvidenceArtifactWriter,
    EvidenceArtifactWriteResult,
} from "../contracts/EvidenceArtifactWriter";

export type WriteEvidenceJsonArtifactInput = {
    context: EvidenceContext;
    metadata?: BuildEvidenceMetadataInput;
};

async function writeJsonFile(filePath: string, content: unknown): Promise<void> {
    const json = JSON.stringify(content, null, 2);
    await fs.writeFile(filePath, `${json}\n`, "utf8");
}

export class WriteEvidenceJsonArtifact
    implements EvidenceArtifactWriter<WriteEvidenceJsonArtifactInput> {
    async write(
        input: WriteEvidenceJsonArtifactInput,
    ): Promise<EvidenceArtifactWriteResult> {
        const paths = buildEvidenceArtifactPath(input.context.runInfo);
        const evidenceJson = buildEvidenceJson(input.context);
        const metadataJson = buildEvidenceMetadata(
            input.context,
            input.metadata ?? {},
        );

        await fs.mkdir(paths.baseDir, { recursive: true });
        await writeJsonFile(paths.evidenceJsonPath, evidenceJson);
        await writeJsonFile(paths.metadataJsonPath, metadataJson);

        return { paths };
    }
}

export async function writeEvidenceJsonArtifact(
    input: WriteEvidenceJsonArtifactInput,
): Promise<EvidenceArtifactWriteResult> {
    const writer = new WriteEvidenceJsonArtifact();
    return writer.write(input);
}