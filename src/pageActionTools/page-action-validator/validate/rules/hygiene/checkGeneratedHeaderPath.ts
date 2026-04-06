// src/pageActionTools/page-action-validator/validate/rules/hygiene/checkGeneratedHeaderPath.ts

import fs from "node:fs";
import { toRepoRelative } from "@utils/paths";
import type { ValidationRule } from "../../types";

export const checkGeneratedHeaderPath: ValidationRule = {
    category: "hygiene",
    name: "checkGeneratedHeaderPath",
    description: "Validate generated header path comment",
    run: (context) => {
        const issues = context.actionFiles.flatMap((filePath) => {
            const firstLine = fs.readFileSync(filePath, "utf8").split("\n")[0]?.trim();
            const expected = `// ${toRepoRelative(filePath)}`;
            return firstLine === expected
                ? []
                : [{
                    level: "warning" as const,
                    message: `Incorrect header path in ${toRepoRelative(filePath)}: expected '${expected}'`,
                }];
        });

        return {
            category: "hygiene",
            name: "checkGeneratedHeaderPath",
            issues,
        };
    },
};
