// src/configLayer/env.ts

import { environments, ENV_NAMES } from "./environments";
import type { EnvKey, TargetEnvUrls } from "./environments";

const LEGACY_ENV_KEY_MAP: Record<string, EnvKey> = {
  azonlinedev: ENV_NAMES.DEV,
  azonlinetest: ENV_NAMES.TEST,
  azonlinedemo: ENV_NAMES.DEMO,
  azonlinenft: ENV_NAMES.NFT,
  [ENV_NAMES.DEV]: ENV_NAMES.DEV,
  [ENV_NAMES.TEST]: ENV_NAMES.TEST,
  [ENV_NAMES.DEMO]: ENV_NAMES.DEMO,
  [ENV_NAMES.NFT]: ENV_NAMES.NFT,
};

export function asEnvKey(value: string): EnvKey {
  const raw = String(value ?? "").trim().toLowerCase();
  const resolved = LEGACY_ENV_KEY_MAP[raw];

  if (!resolved || !environments.envs[resolved]) {
    throw new Error(
      `Unknown environment='${value}'. Available: ${Object.keys(environments.envs).join(", ")}`
    );
  }

  return resolved;
}

export function resolveEnvConfig(environment: EnvKey): TargetEnvUrls {
  return environments.envs[environment];
}
