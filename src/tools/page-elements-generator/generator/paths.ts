// src/tools/page-elements-generator/generator/paths.ts

import path from "node:path";
import { toPascal } from "../../../utils/ts";

export function pageKeyToFolder(pagesDir: string, pageKey: string) {
  const parts = pageKey.split(".");
  return path.join(pagesDir, ...parts);
}

export function mapPageKeyToElementsPath(pagesDir: string, pageKey: string) {
  return path.join(pageKeyToFolder(pagesDir, pageKey), "elements.ts");
}

export function mapPageKeyToAliasesGeneratedPath(pagesDir: string, pageKey: string) {
  return path.join(pageKeyToFolder(pagesDir, pageKey), "aliases.generated.ts");
}

export function mapPageKeyToAliasesHumanPath(pagesDir: string, pageKey: string) {
  return path.join(pageKeyToFolder(pagesDir, pageKey), "aliases.ts");
}

export function mapPageKeyToPageTsPath(pagesDir: string, pageKey: string) {
  const className = `${toPascal(pageKey.split(".").slice(-1)[0] || "Page")}Page`;
  return path.join(pageKeyToFolder(pagesDir, pageKey), `${className}.ts`);
}