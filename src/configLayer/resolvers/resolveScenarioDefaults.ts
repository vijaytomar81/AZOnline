// src/configLayer/resolvers/resolveScenarioDefaults.ts

import { AppError } from "@utils/errors";
import type { Application } from "../models/application.config";
import type { Product } from "../models/product.config";
import { normalizeApplication } from "../normalizers/normalizeApplication";
import { normalizeProduct } from "../normalizers/normalizeProduct";

export function resolveScenarioDefaultsFromData(args: {
    source?: string;
    schemaName?: string;
    applicationOverride?: Application;
    productOverride?: Product;
}): {
    application: Application;
    product: Product;
} {
    const application =
        args.applicationOverride ??
        normalizeApplication(args.source);

    const product =
        args.productOverride ??
        normalizeProduct(args.source) ??
        normalizeProduct(args.schemaName);

    if (!application) {
        throw new AppError({
            code: "DATA_APPLICATION_UNRESOLVED",
            stage: "scenario-defaults",
            source: "resolveScenarioDefaultsFromData",
            message: "Application could not be resolved. Pass --application.",
            context: args,
        });
    }

    if (!product) {
        throw new AppError({
            code: "DATA_PRODUCT_UNRESOLVED",
            stage: "scenario-defaults",
            source: "resolveScenarioDefaultsFromData",
            message: "Product could not be resolved. Pass --product.",
            context: args,
        });
    }

    return { application, product };
}

export function resolveScenarioDefaultsFromE2ERow(args: {
    row: Record<string, unknown>;
    applicationOverride?: Application;
    productOverride?: Product;
}): {
    application: Application;
    product: Product;
} {
    const application =
        normalizeApplication(String(args.row.Application ?? "")) ??
        args.applicationOverride;

    const product =
        normalizeProduct(String(args.row.Product ?? "")) ??
        args.productOverride;

    if (!application) {
        throw new AppError({
            code: "E2E_APPLICATION_UNRESOLVED",
            stage: "scenario-defaults",
            source: "resolveScenarioDefaultsFromE2ERow",
            message: 'Provide "Application" column or --application.',
            context: args.row,
        });
    }

    if (!product) {
        throw new AppError({
            code: "E2E_PRODUCT_UNRESOLVED",
            stage: "scenario-defaults",
            source: "resolveScenarioDefaultsFromE2ERow",
            message: 'Provide "Product" column or --product.',
            context: args.row,
        });
    }

    return { application, product };
}
