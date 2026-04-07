// src/tools/pageObjects/validator/validate/rules/hygiene/moduleHygiene/readRegistryModuleFile.ts

import fs from "node:fs";
import type { RegistryModuleReadResult } from "./moduleHygieneTypes";

export function readRegistryModuleFile(
    filePath: string
): RegistryModuleReadResult {
    if (!fs.existsSync(filePath)) {
        return {
            exists: false,
            content: "",
        };
    }

    return {
        exists: true,
        content: fs.readFileSync(filePath, "utf8"),
    };
}
