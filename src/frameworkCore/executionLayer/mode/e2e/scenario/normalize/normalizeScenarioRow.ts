// src/frameworkCore/executionLayer/mode/e2e/scenario/normalize/normalizeScenarioRow.ts

import { AppError } from "@utils/errors";
import { normalizePlatform } from "@configLayer/normalizers/normalizePlatform";
import { normalizeApplication } from "@configLayer/normalizers/normalizeApplication";
import { normalizeProduct } from "@configLayer/normalizers/normalizeProduct";
import type { Platform } from "@configLayer/models/platform.config";
import type { Application } from "@configLayer/models/application.config";
import type { Product } from "@configLayer/models/product.config";
import type { ExecutionScenario } from "@frameworkCore/executionLayer/contracts";
import type { RawExecutionScenarioRow } from "../types";
import { createExecutionItemsFromRow } from "./createExecutionItemsFromRow";
import { getTotalItems } from "./getTotalItems";
import { normalizeExecute } from "./normalizeExecute";
import { normalizeJourneyStartWith } from "./normalizeJourneyStartWith";
import { getString } from "./shared";

function resolvePlatform(
    raw: unknown,
    fallback?: Platform
): Platform {
    const resolved = normalizePlatform(String(raw ?? "")) ?? fallback;

    if (resolved) {
        return resolved;
    }

    throw new AppError({
        code: "E2E_PLATFORM_MISSING",
        stage: "scenario-normalize",
        source: "normalizeScenarioRow",
        message: 'Provide "Platform" column or --platform.',
    });
}

function resolveApplication(
    raw: unknown,
    fallback?: Application
): Application {
    const resolved = normalizeApplication(String(raw ?? "")) ?? fallback;

    if (resolved) {
        return resolved;
    }

    throw new AppError({
        code: "E2E_APPLICATION_MISSING",
        stage: "scenario-normalize",
        source: "normalizeScenarioRow",
        message: 'Provide "Application" column or --application.',
    });
}

function resolveProduct(
    raw: unknown,
    fallback?: Product
): Product {
    const resolved = normalizeProduct(String(raw ?? "")) ?? fallback;

    if (resolved) {
        return resolved;
    }

    throw new AppError({
        code: "E2E_PRODUCT_MISSING",
        stage: "scenario-normalize",
        source: "normalizeScenarioRow",
        message: 'Provide "Product" column or --product.',
    });
}

export function normalizeScenarioRow(
    row: RawExecutionScenarioRow,
    opts: {
        platform?: Platform;
        application?: Application;
        product?: Product;
    } = {}
): ExecutionScenario {
    const totalItems = getTotalItems(row.TotalItems);
    const policyNumber = getString(row.PolicyNumber) || undefined;

    return {
        scenarioId: getString(row.ScenarioId),
        scenarioName: getString(row.ScenarioName),
        platform: resolvePlatform(row.Platform, opts.platform),
        application: resolveApplication(row.Application, opts.application),
        product: resolveProduct(row.Product, opts.product),
        journeyStartWith: normalizeJourneyStartWith({
            value: row.JourneyStartWith,
            policyNumber,
        }),
        policyNumber,
        loginId: getString(row.LoginId) || undefined,
        password: getString(row.Password) || undefined,
        description: getString(row.Description),
        execute: normalizeExecute(row.Execute),
        totalItems,
        items: createExecutionItemsFromRow(row, totalItems),
    };
}
