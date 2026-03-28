// src/execution/journeys/newBusiness/pcwTool/resolvePcwToolJourney.ts

import { AppError } from "@utils/errors";
import { normalizeSpaces } from "@utils/text";
import { getPcwToolData } from "./getPcwToolData";
import { normalizePcwToolJourneyLabel } from "./normalizePcwToolJourneyLabel";

function normalizeJourneyKey(value?: string): string {
    return normalizeSpaces(String(value ?? ""))
        .toLowerCase()
        .replace(/\s+/g, "");
}

export function resolvePcwToolJourney(
    stepData?: Record<string, unknown>
): string {
    const pcwTool = getPcwToolData(stepData);
    const raw =
        normalizeSpaces(String(pcwTool.journey ?? "")) ||
        normalizeSpaces(String(pcwTool.pcwToolPortal ?? ""));

    if (!raw) {
        throw new AppError({
            code: "PCW_TOOL_JOURNEY_MISSING",
            stage: "execution-handler",
            source: "newBusiness-pcwTool",
            message: "Journey is required (MSM, CTM, CNF, GoCo).",
        });
    }

    const normalized = normalizeJourneyKey(raw);
    const allowed = ["msm", "ctm", "cnf", "goco"];

    if (!allowed.includes(normalized)) {
        throw new AppError({
            code: "PCW_TOOL_JOURNEY_UNSUPPORTED",
            stage: "execution-handler",
            source: "newBusiness-pcwTool",
            message: `Unsupported Journey "${raw}". Allowed values: MSM, CTM, CNF, GoCo.`,
            context: {
                journey: raw,
                allowed: allowed.join(", "),
            },
        });
    }

    return normalizePcwToolJourneyLabel(raw);
}
