// src/evidenceFactory/factory/helpers/build-summary-manifest-event.ts

import { nowIso } from '../../utils/time-utils';
import type {
    EvidenceWriteSummaryRequest,
    ManifestSummaryEvent,
} from '../../contracts/types';

export function buildSummaryManifestEvent(
    request: EvidenceWriteSummaryRequest,
    workerId: string,
): ManifestSummaryEvent {
    return {
        eventType: 'summary',
        executionId: request.executionId,
        suiteName: request.suiteName,
        workerId,
        metaPayload: request.metaPayload,
        outputFormats: request.outputFormats,
        createdAt: nowIso(),
    };
}