// src/config/environments/index.ts

import type { EnvironmentsConfig } from "./types";
import { devEnv } from "./dev";
import { testEnv } from "./test";
import { demoEnv } from "./demo";
import { nftEnv } from "./nft";

export const environments: EnvironmentsConfig = {
    defaultEnv: "test",
    calculatedEmailBase: "athena.test.team@gmail.com",
    envs: {
        dev: devEnv,
        test: testEnv,
        demo: demoEnv,
        nft: nftEnv,
    },
};

export type * from "./types";
