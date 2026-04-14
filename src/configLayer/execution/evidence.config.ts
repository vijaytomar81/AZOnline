// src/configLayer/execution/evidence.config.ts

import { envBool, envNumber } from "@utils/env";

export type EvidenceConfig = {
  fileNaming: {
    includeTimestamp: boolean;
  };
  archive: {
    olderThanDays?: number;
    zip: boolean;
    maxCurrentExecutionsPerSuite?: number;
  };
};

export const evidenceConfig: EvidenceConfig = {
  fileNaming: {
    includeTimestamp: envBool("EVIDENCE_INCLUDE_TIMESTAMP", false),
  },
  archive: {
    olderThanDays: envNumber("EVIDENCE_ARCHIVE_OLDER_THAN_DAYS", 1),
    zip: envBool("EVIDENCE_ARCHIVE_ZIP", true),
    maxCurrentExecutionsPerSuite: envNumber(
      "EVIDENCE_MAX_CURRENT_EXECUTIONS_PER_SUITE",
      5
    ),
  },
};
