// src/utils/paths/dataLayer.ts

import path from "node:path";
import { toKebabFromSnake } from "../text";
import { DATA_LAYER_DIR } from "./core";

export const DATA_BUILDER_DIR = path.join(DATA_LAYER_DIR, "builder");
export const DATA_BUILDER_PLUGINS_DIR = path.join(
    DATA_BUILDER_DIR,
    "plugins"
);

export const DATA_RUNTIME_DIR = path.join(DATA_LAYER_DIR, "runtime");
export const DATA_DEFINITIONS_DIR = path.join(
    DATA_LAYER_DIR,
    "data-definitions"
);

export const DATA_GENERATED_DIR = path.join(DATA_LAYER_DIR, "generated");
export const DATA_GENERATED_ARCHIVE_DIR = path.join(
    DATA_GENERATED_DIR,
    "archive"
);
export const DATA_GENERATED_INDEX_FILE = path.join(
    DATA_GENERATED_DIR,
    "index.json"
);

export const DATA_DOMAINS = {
    NEW_BUSINESS: "new-business",
} as const;

export type DataDomain =
    (typeof DATA_DOMAINS)[keyof typeof DATA_DOMAINS];

export const DATA_GENERATED_NEW_BUSINESS_DIR = path.join(
    DATA_GENERATED_DIR,
    DATA_DOMAINS.NEW_BUSINESS
);

export function getGeneratedSchemaDir(schemaName: string): string {
    return getGeneratedSchemaDirByDomain(
        DATA_DOMAINS.NEW_BUSINESS,
        schemaName
    );
}

export function getGeneratedSchemaArchiveDir(schemaName: string): string {
    return path.join(
        DATA_GENERATED_ARCHIVE_DIR,
        DATA_DOMAINS.NEW_BUSINESS,
        toKebabFromSnake(schemaName)
    );
}

export function getGeneratedSchemaDirByDomain(
    domain: DataDomain,
    schemaName: string
): string {
    return path.join(
        DATA_GENERATED_DIR,
        domain,
        toKebabFromSnake(schemaName)
    );
}
