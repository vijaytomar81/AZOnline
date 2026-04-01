// src/automation/engine/index.ts

export type {
    AliasMap,
    BasePageOptions,
    ElementDef,
    HealEvent,
    LocatorEngineOptions,
    ResolveKeyResult,
    SelfHealWriterOptions,
} from "./types";

export { LocatorEngine } from "./LocatorEngine";
export { PageFx } from "./PageFx";
export { SelfHealWriter } from "./SelfHealWriter";