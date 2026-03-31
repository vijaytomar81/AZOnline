// src/dataLayer/builder/core/pluginLoader.ts

export {
    loadPluginsFromFolder,
    type DiscoveredPlugin,
} from "./plugin/pluginDiscovery";

export { resolvePluginRunOrder } from "./plugin/pluginOrder";

export { runDiscoveredPlugins } from "./plugin/pluginExecutor";