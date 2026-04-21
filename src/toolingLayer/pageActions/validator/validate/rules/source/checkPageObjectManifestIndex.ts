// src/toolingLayer/pageActions/validator/validate/rules/source/checkPageObjectManifestIndex.ts

import fs from "node:fs";
import { PAGE_MANIFEST_INDEX_FILE } from "@utils/paths";
import type { ValidationCheckResult } from "../../pipeline/types";

export function checkPageObjectManifestIndex(): ValidationCheckResult {
    try {
        const raw = fs.readFileSync(PAGE_MANIFEST_INDEX_FILE, "utf8");
        const json = JSON.parse(raw) as {
            pages?: unknown;
        };

        const ok =
            typeof json.pages === "object" &&
            json.pages !== null &&
            !Array.isArray(json.pages);

        return {
            id: "checkPageObjectManifestIndex",
            severity: ok ? "success" : "error",
            summary: ok ? "no issues" : "pages must be object map",
        };
    } catch {
        return {
            id: "checkPageObjectManifestIndex",
            severity: "error",
            summary: "invalid pageObjects manifest index",
        };
    }
}
