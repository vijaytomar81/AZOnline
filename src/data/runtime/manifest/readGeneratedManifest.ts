// src/data/runtime/manifest/readGeneratedManifest.ts

import fs from "node:fs";
import { DATA_GENERATED_INDEX_FILE } from "@utils/paths";
import type { GeneratedManifest } from "./types";

function buildEmptyManifest(): GeneratedManifest {
    return {
        generatedAt: new Date().toISOString(),
        data: {},
    };
}

export function readGeneratedManifest(): GeneratedManifest {
    if (!fs.existsSync(DATA_GENERATED_INDEX_FILE)) {
        return buildEmptyManifest();
    }

    try {
        const raw = fs.readFileSync(DATA_GENERATED_INDEX_FILE, "utf8");
        const parsed = JSON.parse(raw) as Partial<GeneratedManifest>;

        return {
            generatedAt: String(parsed.generatedAt ?? new Date().toISOString()),
            data: parsed.data ?? {},
        };
    } catch {
        return buildEmptyManifest();
    }
}