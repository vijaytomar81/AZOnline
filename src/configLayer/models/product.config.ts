// src/configLayer/models/product.config.ts

/**
 * =========================================================
 * 🧱 PRODUCT DEFINITIONS (SOURCE OF TRUTH)
 * =========================================================
 */

export const PRODUCTS = {
    MOTOR: "Motor",
    HOME: "Home",
} as const;

/**
 * Strongly typed Product
 */
export type Product =
    (typeof PRODUCTS)[keyof typeof PRODUCTS];

/* =========================================================
 * 🎯 SUPPORTED PRODUCTS
 * ======================================================= */

export const SUPPORTED_PRODUCTS: Product[] = [
    PRODUCTS.MOTOR,
    PRODUCTS.HOME,
];
