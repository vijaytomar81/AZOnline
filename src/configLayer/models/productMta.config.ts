// src/configLayer/models/productMta.config.ts

import {
    MTA_TYPES,
    type MtaType,
} from "./journeyContext.config";
import {
    PRODUCTS,
    type Product,
} from "./product.config";

export const PRODUCT_MTA_TYPES: Record<
    Product,
    readonly MtaType[]
> = {
    [PRODUCTS.MOTOR]: Object.values(MTA_TYPES),

    [PRODUCTS.HOME]: [
        MTA_TYPES.CHANGE_ADDRESS,
    ],
};

export function getProductMtaTypes(
    product: Product
): readonly MtaType[] {
    return PRODUCT_MTA_TYPES[product];
}
