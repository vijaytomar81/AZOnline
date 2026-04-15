// src/configLayer/normalizers/normalizeApplication.ts

import { normalizeLookupKey } from "@utils/text";
import { APPLICATIONS, type Application } from "../models/application.config";

/* =========================================================
 * 🔁 LOOKUP TABLE
 * ======================================================= */

const APPLICATION_LOOKUP: Record<string, Application> = {
    azonline: APPLICATIONS.AZ_ONLINE,
    ferry: APPLICATIONS.FERRY,
    britannia: APPLICATIONS.BRITANNIA,

    msm: APPLICATIONS.MSM,
    ctm: APPLICATIONS.CTM,
    cnf: APPLICATIONS.CNF,
    goco: APPLICATIONS.GOCO,
};

/* =========================================================
 * 🚀 PUBLIC API
 * ======================================================= */

export function normalizeApplication(
    raw?: string
): Application | undefined {
    return APPLICATION_LOOKUP[normalizeLookupKey(raw)];
}
