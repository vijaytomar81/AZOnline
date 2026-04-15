// src/frameworkCore/executionLayer/cli/parsers/journey/parseJourneyContext.ts

import { normalizeSpaces } from "@utils/text";
import { AppError } from "@utils/errors";
import {
    JOURNEY_TYPES,
    MTA_TYPES,
    type JourneyContext,
    type MtaType,
} from "@configLayer/models/journeyContext.config";

function parseJourneySubType(raw?: string): MtaType | undefined {
    const value = normalizeSpaces(String(raw ?? ""));

    if (!value) {
        return undefined;
    }

    const allowed = Object.values(MTA_TYPES);
    const resolved = allowed.find(
        (item) => item.toLowerCase() === value.toLowerCase()
    );

    if (resolved) {
        return resolved;
    }

    throw new AppError({
        code: "INVALID_JOURNEY_SUBTYPE",
        stage: "cli-parse",
        source: "parseJourneyContext",
        message: `Invalid --journeySubType value "${raw}". Allowed: ${allowed.join(", ")}.`,
    });
}

export function parseJourneyContext(args: {
    journeyContextRaw?: string;
    journeySubTypeRaw?: string;
}): JourneyContext | undefined {
    const value = normalizeSpaces(String(args.journeyContextRaw ?? ""));
    const subType = parseJourneySubType(args.journeySubTypeRaw);

    if (!value) {
        return undefined;
    }

    if (value === JOURNEY_TYPES.NEW_BUSINESS) {
        return { type: JOURNEY_TYPES.NEW_BUSINESS };
    }

    if (value === JOURNEY_TYPES.RENEWAL) {
        return { type: JOURNEY_TYPES.RENEWAL };
    }

    if (value === JOURNEY_TYPES.MTC) {
        return { type: JOURNEY_TYPES.MTC };
    }

    if (value === JOURNEY_TYPES.MTA) {
        if (!subType) {
            throw new AppError({
                code: "JOURNEY_SUBTYPE_MISSING",
                stage: "cli-parse",
                source: "parseJourneyContext",
                message:
                    `When --journeyContext is "${JOURNEY_TYPES.MTA}", ` +
                    `--journeySubType is required. Allowed: ${Object.values(MTA_TYPES).join(", ")}.`,
            });
        }

        return {
            type: JOURNEY_TYPES.MTA,
            subType,
        };
    }

    throw new AppError({
        code: "INVALID_JOURNEY_CONTEXT",
        stage: "cli-parse",
        source: "parseJourneyContext",
        message: `Invalid --journeyContext value "${args.journeyContextRaw}".`,
    });
}
