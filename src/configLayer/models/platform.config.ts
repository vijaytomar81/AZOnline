// src/configLayer/models/platform.config.ts

export const PLATFORMS = {
    ATHENA: "Athena",
    PCW: "PCW",
    PCW_TOOL: "PCWTool",
} as const;

export type Platform =
    (typeof PLATFORMS)[keyof typeof PLATFORMS];

export function isAthenaPlatform(platform: Platform): boolean {
    return platform === PLATFORMS.ATHENA;
}

export function isPcwPlatform(platform: Platform): boolean {
    return platform === PLATFORMS.PCW;
}

export function isPcwToolPlatform(platform: Platform): boolean {
    return platform === PLATFORMS.PCW_TOOL;
}
