// src/automation/base/index.ts

export type {
    AutomationPageDriver,
    ElementsMap,
    ResolvedAliasLocator,
} from "./AutomationPageDriver";

export { BasePage } from "./BasePage";
export { BasePageRuntime } from "./BasePageRuntime";
export { BasePageAliasBridge } from "./BasePageAliasBridge";
export { BasePageNavigation } from "./BasePageNavigation";
export { BaseActions } from "./BaseActions";
export { BaseWaits } from "./BaseWaits";
export { BaseReads } from "./BaseReads";
export {
    getElementDefFromKey,
    getElementKeyFromAlias,
} from "./BasePageAliasResolver";