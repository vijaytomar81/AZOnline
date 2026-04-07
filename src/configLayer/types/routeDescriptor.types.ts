// src/configLayer/types/routeDescriptor.types.ts

import type { Platform } from "../models/platform.config";
import type { Application } from "../models/application.config";
import type { Product } from "../models/product.config";
import type { PolicyContext } from "../models/policyContext.config";

export type RouteEntryPoint = "Direct" | "PCW" | "PCWTool";

export type RouteDescriptor = {
    platform?: Platform;
    application?: Application;
    product?: Product;
    policyContext?: PolicyContext;
    entryPoint?: RouteEntryPoint;
};
