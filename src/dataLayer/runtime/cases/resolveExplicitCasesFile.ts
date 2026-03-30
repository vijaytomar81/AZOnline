// src/dataLayer/runtime/cases/resolveExplicitCasesFile.ts

import path from "node:path";
import { ROOT } from "@utils/paths";

export function resolveExplicitCasesFile(): string | null {
    const explicit = String(process.env.CASES_FILE ?? "").trim();

    if (!explicit) {
        return null;
    }

    return path.isAbsolute(explicit)
        ? explicit
        : path.join(ROOT, explicit);
}