// src/evidenceFactory/factory/helpers/build-item-manifest-event.ts

import { nowIso } from '../../utils/time-utils';
import { normalizeStatus } from '../../utils/status-utils';
import type {
    EvidenceWriteItemRequest,
    ManifestItemEvent,
} from '../../contracts/types';

export function buildItemManifestEvent(
    request: EvidenceWriteItemRequest,
    workerId: string,
): ManifestItemEvent {
    return {
        eventType: 'item',
        executionId: request.executionId,
        suiteName: request.suiteName,
        workerId,
        artifactId: request.artifactId,
        artifactName: request.artifactName,
        status: normalizeStatus(request.status),
        consoleMode: request.consoleMode,
        outputFormats: request.outputFormats,
        payload: request.payload,
        createdAt: nowIso(),
    };
}