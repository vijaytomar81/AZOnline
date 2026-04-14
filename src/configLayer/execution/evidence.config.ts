// src/configLayer/execution/evidence.config.ts

import { envBool } from "@utils/env";

export type EvidenceConfig = {
  fileNaming: {
    includeTimestamp: boolean;
  };
};

export const evidenceConfig: EvidenceConfig = {
  fileNaming: {
    includeTimestamp: envBool("EVIDENCE_INCLUDE_TIMESTAMP", true),
  },
};
