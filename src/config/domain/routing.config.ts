// src/config/domain/routing.config.ts

import type { Journey } from "./journey.config";

export const APPLICATIONS = {
    AZ_ONLINE: "AzOnline",
    FERRY: "Ferry",
    BRITANNIA: "Britannia",
} as const;

export const PRODUCTS = {
    MOTOR: "Motor",
    HOME: "Home",
} as const;

export type Application =
    (typeof APPLICATIONS)[keyof typeof APPLICATIONS];

export type Product =
    (typeof PRODUCTS)[keyof typeof PRODUCTS];

export type RouteEntryPoint = "Direct" | "PCW" | "PCWTool";

export type RoutePolicyContext = "NewBusiness" | "ExistingPolicy";

export type RouteDescriptor = {
    journey: Journey;
    policyContext: RoutePolicyContext;
    entryPoint?: RouteEntryPoint;
    application?: Application;
    product?: Product;
};

export const DEFAULT_APPLICATION: Application = APPLICATIONS.AZ_ONLINE;
export const DEFAULT_PRODUCT: Product = PRODUCTS.MOTOR;
