// src/configLayer/environments/index.ts

import type { EnvironmentsConfig } from "./types";
import { ENV_NAMES } from "./envNames";
import { devEnv } from "./dev";
import { testEnv } from "./test";
import { demoEnv } from "./demo";
import { nftEnv } from "./nft";

export const environments: EnvironmentsConfig = {
    calculatedEmailBase: "athena.test.team@gmail.com",
    envs: {
        [ENV_NAMES.DEV]: devEnv,
        [ENV_NAMES.TEST]: testEnv,
        [ENV_NAMES.DEMO]: demoEnv,
        [ENV_NAMES.NFT]: nftEnv,
    },
};

export { ENV_NAMES };
export type * from "./envNames";
export type * from "./types";
