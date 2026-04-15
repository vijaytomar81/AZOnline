// src/utils/paths/helpers.ts

import path from "node:path";
import { ROOT } from "./core";

export function toRepoRelative(filePath: string): string {
    return path.relative(ROOT, filePath).replace(/\\/g, "/");
}
