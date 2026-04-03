// src/executionLayer/cli/parseRoutingArgs.ts

import { AppError } from "@utils/errors";
import { normalizeSpaces } from "@utils/text";
import {
    APPLICATIONS,
    PRODUCTS,
    type Application,
    type Product,
} from "@config/domain/routing.config";

const APPLICATION_MAP: Record<string, Application> = {
    azonline: APPLICATIONS.AZ_ONLINE,
    ferry: APPLICATIONS.FERRY,
    britannia: APPLICATIONS.BRITANNIA,
};

const PRODUCT_MAP: Record<string, Product> = {
    motor: PRODUCTS.MOTOR,
    home: PRODUCTS.HOME,
};

export function parseApplication(raw?: string): Application | undefined {
    const value = normalizeSpaces(String(raw ?? "")).toLowerCase();

    if (!value) {
        return undefined;
    }

    const resolved = APPLICATION_MAP[value];

    if (resolved) {
        return resolved;
    }

    throw new AppError({
        code: "INVALID_APPLICATION",
        stage: "cli-parse",
        source: "parseApplication",
        message: `Invalid --app value "${raw}". Allowed: AzOnline, Ferry, Britannia.`,
    });
}

export function parseProduct(raw?: string): Product | undefined {
    const value = normalizeSpaces(String(raw ?? "")).toLowerCase();

    if (!value) {
        return undefined;
    }

    const resolved = PRODUCT_MAP[value];

    if (resolved) {
        return resolved;
    }

    throw new AppError({
        code: "INVALID_PRODUCT",
        stage: "cli-parse",
        source: "parseProduct",
        message: `Invalid --product value "${raw}". Allowed: Motor, Home.`,
    });
}
