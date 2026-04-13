// src/configLayer/domain/supportedProducts.ts

export const SUPPORTED_PRODUCTS = {
    MOTOR: "motor",
    HOME: "home",
} as const;

export type SupportedProduct =
    typeof SUPPORTED_PRODUCTS[keyof typeof SUPPORTED_PRODUCTS];
