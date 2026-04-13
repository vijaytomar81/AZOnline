// src/configLayer/environments/envNames.ts

export const ENV_NAMES = {
    DEV: "dev",
    TEST: "test",
    DEMO: "demo",
    NFT: "nft",
} as const;

export type EnvKey = typeof ENV_NAMES[keyof typeof ENV_NAMES];