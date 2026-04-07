// src/configLayer/normalizers/normalizeProduct.ts

import { normalizeLookupKey } from "@utils/text";
import { PRODUCTS, type Product } from "../models/product.config";

/* =========================================================
 * 🔁 LOOKUP TABLE
 * ======================================================= */

const PRODUCT_LOOKUP: Record<string, Product> = {
    motor: PRODUCTS.MOTOR,
    home: PRODUCTS.HOME,
};

/* =========================================================
 * 🚀 PUBLIC API
 * ======================================================= */

export function normalizeProduct(
    raw?: string
): Product | undefined {
    return PRODUCT_LOOKUP[normalizeLookupKey(raw)];
}
