// src/dataLayer/runtime/manifest/upsertGeneratedManifestItem.ts

import { writeJsonFile } from "@utils/fileFormats/json";
import { DATA_GENERATED_INDEX_FILE } from "@utils/paths";
import type { GeneratedManifest, GeneratedManifestItem } from "./types";

export function upsertGeneratedManifestItem(args: {
    manifest: GeneratedManifest;
    item: GeneratedManifestItem;
}): void {
    args.manifest.generatedAt = new Date().toISOString();
    args.manifest.data[args.item.key] = args.item;

    writeJsonFile(DATA_GENERATED_INDEX_FILE, args.manifest);
}
