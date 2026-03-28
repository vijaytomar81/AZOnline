// src/execution/journeys/newBusiness/pcwTool/normalizePcwToolJourneyLabel.ts

import { normalizeSpaces } from "@utils/text";

function normalizeJourneyKey(value?: string): string {
    return normalizeSpaces(String(value ?? ""))
        .toLowerCase()
        .replace(/\s+/g, "");
}

export function normalizePcwToolJourneyLabel(raw: string): string {
    const key = normalizeJourneyKey(raw);

    if (key === "ctm") return "CTM";
    if (key === "cnf") return "CNF";
    if (key === "msm") return "MSM";
    if (key === "goco") return "GoCo";

    return raw.trim();
}
