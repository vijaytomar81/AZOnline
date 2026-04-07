// src/config/env.ts

import { environments } from "./environments";
import type { EnvKey } from "./environments";

const LEGACY_ENV_KEY_MAP: Record<string, EnvKey> = {
  azonlinedev: "dev",
  azonlinetest: "test",
  azonlinedemo: "demo",
  azonlinenft: "nft",
  dev: "dev",
  test: "test",
  demo: "demo",
  nft: "nft",
};

function asEnvKey(value: string | undefined): EnvKey {
  const raw = String(value ?? environments.defaultEnv).trim().toLowerCase();
  const resolved = LEGACY_ENV_KEY_MAP[raw];

  if (!resolved || !environments.envs[resolved]) {
    throw new Error(
      `Unknown TARGET_ENV='${value}'. Available: ${Object.keys(environments.envs).join(", ")}`
    );
  }

  return resolved;
}

const targetEnv = asEnvKey(process.env.TARGET_ENV);

export const envConfig = {
  name: targetEnv,
  env: environments.envs[targetEnv],
};