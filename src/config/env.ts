import { environments } from "./environments";
import type { EnvKey, PcwKey } from "./environments";

export type StartFrom = 'pcw' | 'env';

function asEnvKey(value: string | undefined): EnvKey {
  const v = (value ?? environments.defaultEnv) as EnvKey;
  if (!environments.envs[v]) {
    throw new Error(
      `Unknown TARGET_ENV='${v}'. Available: ${Object.keys(environments.envs).join(', ')}`
    );
  }
  return v;
}

function asStartFrom(value: string | undefined): StartFrom {
  const v = (value ?? 'env').toLowerCase();
  if (v !== 'pcw' && v !== 'env') {
    throw new Error(`Unknown START_FROM='${value}'. Use START_FROM=pcw or START_FROM=env`);
  }
  return v as StartFrom;
}

function asPcwKey(value: string | undefined): PcwKey {
  const v = (value ?? 'goco') as PcwKey;
  if (!environments.pcw[v]) {
    throw new Error(
      `Unknown PCW_APP='${v}'. Available: ${Object.keys(environments.pcw).join(', ')}`
    );
  }
  return v;
}

const targetEnv = asEnvKey(process.env.TARGET_ENV);
const startFrom = asStartFrom(process.env.START_FROM);

const pcwApp = startFrom === 'pcw' ? asPcwKey(process.env.PCW_APP) : null;
const pcwUrl = pcwApp ? environments.pcw[pcwApp] : null;

export const envConfig = {
  name: targetEnv,
  startFrom,                 // 'pcw' or 'env'
  env: environments.envs[targetEnv],   // ALL env urls
  pcwApp,                    // selected pcw key or null
  pcwUrl,                    // selected pcw url or null
};
