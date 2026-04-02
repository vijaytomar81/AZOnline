// src/automation/diagnostics/index.ts

export { isLocatorFailure } from "./isLocatorFailure";

export {
    runPageScanOnLocatorFailure,
    type PageScanResult,
} from "./runPageScanOnLocatorFailure";

export {
    captureFailureState,
    type FailureState,
} from "./captureFailureState";
