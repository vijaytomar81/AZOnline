// src/evidenceFactory/adapters/playwright-adapter.ts
import { ArtifactMetadata } from '../contracts/types';

export type AttachmentCapable = {
  attach(name: string, options: { path: string }): Promise<void>;
};

export async function attachArtifacts(testInfo: AttachmentCapable, artifacts: ArtifactMetadata[]): Promise<void> {
  for (const artifact of artifacts) {
    if (artifact.filePath) {
      await testInfo.attach(artifact.format, { path: artifact.filePath });
    }
  }
}
