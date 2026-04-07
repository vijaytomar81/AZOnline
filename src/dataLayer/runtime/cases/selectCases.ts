// src/dataLayer/runtime/cases/selectCases.ts

import type { Application } from "@configLayer/models/application.config";
import type { JourneyContext } from "@configLayer/models/journeyContext.config";
import type { Platform } from "@configLayer/models/platform.config";
import type { Product } from "@configLayer/models/product.config";
import { DataBuilderError } from "../../builder/errors";
import { loadCases, CaseObject } from "./loadCases";

export function selectCases(args: {
    platform: Platform;
    application: Application;
    product: Product;
    journeyContext: JourneyContext;
    sheetName: string;
    schemaName?: string;
}): Array<{ scriptName: string; payload: CaseObject }> {
    const all = loadCases(args);
    const filter = String(process.env.CASE ?? "").trim();

    if (!filter) {
        return all;
    }

    const wanted = filter
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    const byName = new Map(all.map((c) => [c.scriptName, c]));
    const missing: string[] = [];

    const selected = wanted.flatMap((name) => {
        const hit = byName.get(name);
        if (!hit) missing.push(name);
        return hit ? [hit] : [];
    });

    if (missing.length) {
        throw new DataBuilderError({
            code: "CASE_SELECTION_ERROR",
            stage: "select-cases",
            source: "selectCases",
            message: `CASE selection error. Missing scriptName(s): ${missing.join(", ")}`,
            context: {
                platform: args.platform,
                application: args.application,
                product: args.product,
                journeyContext: args.journeyContext,
                sheetName: args.sheetName,
                schemaName: args.schemaName ?? "",
                requestedCases: wanted.join(", "),
                missingCases: missing.join(", "),
            },
        });
    }

    return selected;
}
