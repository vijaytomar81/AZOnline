// src/utils/paths/core.ts

import path from "node:path";

export const ROOT = process.cwd();
export const SRC_DIR = path.join(ROOT, "src");

export const FRAMEWORK_CORE_DIR = path.join(SRC_DIR, "frameworkCore");
export const BUSINESS_LAYER_DIR = path.join(SRC_DIR, "businessLayer");
export const CONFIG_LAYER_DIR = path.join(SRC_DIR, "configLayer");
export const DATA_LAYER_DIR = path.join(SRC_DIR, "dataLayer");
export const INTEGRATIONS_DIR = path.join(SRC_DIR, "integrations");
export const TOOLING_LAYER_DIR = path.join(SRC_DIR, "toolingLayer");
