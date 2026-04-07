// src/tools/pageObjects/generator/generator/paths.ts
import { buildPageArtifact } from "./pageArtifact";

export function pageKeyToFolder(pagesDir: string, pageKey: string) {
  return buildPageArtifact(pagesDir, pageKey).folderPath;
}

export function mapPageKeyToElementsPath(pagesDir: string, pageKey: string) {
  return buildPageArtifact(pagesDir, pageKey).elementsPath;
}

export function mapPageKeyToAliasesGeneratedPath(pagesDir: string, pageKey: string) {
  return buildPageArtifact(pagesDir, pageKey).aliasesGeneratedPath;
}

export function mapPageKeyToAliasesHumanPath(pagesDir: string, pageKey: string) {
  return buildPageArtifact(pagesDir, pageKey).aliasesHumanPath;
}

export function mapPageKeyToPageTsPath(pagesDir: string, pageKey: string) {
  return buildPageArtifact(pagesDir, pageKey).pageObjectPath;
}