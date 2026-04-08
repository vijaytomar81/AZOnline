// src/frameworkCore/logging/utils/parseEnabledLogCategories.ts

import {
    getAllLogCategories,
    type LogCategory,
} from "@frameworkCore/logging/core/logCategories";

export function parseEnabledLogCategories(
    input?: string
): Set<LogCategory> {
    const all = getAllLogCategories();

    if (!input || input.trim() === "") {
        return new Set(all);
    }

    const normalized = input.trim().toLowerCase();

    if (normalized === "all") {
        return new Set(all);
    }

    const values = normalized
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

    const enabled = new Set<LogCategory>();

    values.forEach((value) => {
        if (all.includes(value as LogCategory)) {
            enabled.add(value as LogCategory);
        }
    });

    return enabled;
}