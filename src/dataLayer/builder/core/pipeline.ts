// src/dataLayer/builder/core/pipeline.ts

import type { DataBuilderContext } from "../types";

/**
 * In builder, the pipeline context IS the DataBuilderContext.
 * This avoids incompatible ctx typing between core + plugins.
 */
export type PipelineContext = DataBuilderContext;

export type PipelinePlugin = {
  /** unique plugin name */
  name: string;

  /** optional tie-breaker */
  order?: number;

  /** keys required before plugin runs (can include external:<key>) */
  requires?: string[];

  /** keys produced by plugin */
  provides?: string[];

  /** plugin execution */
  run: (ctx: PipelineContext) => Promise<void> | void;
};