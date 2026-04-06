// src/config/domain/product.inference.config.ts

import {
    PRODUCTS,
    type Product,
} from "./routing.config";

export type ProductInferenceRule = {
    tokens: string[];
    product: Product;
};

export const PRODUCT_RAW_VALUE_MAP: Record<string, Product> = {
    motor: PRODUCTS.MOTOR,
    home: PRODUCTS.HOME,
};

export const PRODUCT_SOURCE_RULES: ProductInferenceRule[] = [
    {
        tokens: ["motor"],
        product: PRODUCTS.MOTOR,
    },
    {
        tokens: ["home"],
        product: PRODUCTS.HOME,
    },
];
