// src/scanner/elements-generator/index.ts

export { runElementsGenerator } from "./runner";

export type { GenOptions, PageMap, StateFile } from "./types";

// handy exports if commands/validators want them later
export {
    pageKeyToFolder,
    mapPageKeyToElementsPath,
    mapPageKeyToAliasesGeneratedPath,
    mapPageKeyToAliasesHumanPath,
    mapPageKeyToPageTsPath,
} from "./paths";