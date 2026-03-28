// src/execution/core/executionContext.ts

export type { ExecutionContext } from "./context/executionContext.types";
export { createExecutionContext } from "./context/createExecutionContext";
export { setContextOutput, getContextOutput } from "./context/outputs";
export { addStepResult } from "./context/stepResults";
