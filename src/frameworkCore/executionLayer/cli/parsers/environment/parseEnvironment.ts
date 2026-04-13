// src/frameworkCore/executionLayer/cli/parsers/environment/parseEnvironment.ts

import { AppError } from "@utils/errors";
import { normalizeSpaces } from "@utils/text";
import {
    environments,
    type EnvKey,
} from "@configLayer/environments";

export function parseEnvironment(raw?: string): EnvKey {
    const value = normalizeSpaces(String(raw ?? ""));

    const allowed = Object.keys(environments.envs) as EnvKey[];

    if (!value) {
        throw new AppError({
            code: "ENVIRONMENT_REQUIRED",
            stage: "cli-parse",
            source: "parseEnvironment",
            message: `--environment is required. Allowed: ${allowed.join(", ")}.`,
        });
    }

    const resolved = allowed.find(
        (item) => item.toLowerCase() === value.toLowerCase()
    );

    if (resolved) {
        return resolved;
    }

    throw new AppError({
        code: "INVALID_ENVIRONMENT",
        stage: "cli-parse",
        source: "parseEnvironment",
        message: `Invalid --environment value "${raw}". Allowed: ${allowed.join(", ")}.`,
    });
}