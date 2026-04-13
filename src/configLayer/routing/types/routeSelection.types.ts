// src/configLayer/routing/types/routeSelection.types.ts

import type { Platform } from "../../models/platform.config";
import type { Application } from "../../models/application.config";
import type { Product } from "../../models/product.config";
import type { JourneyContext } from "../../models/journeyContext.config";

export type RouteSelection = {
    platform: Platform;
    application: Application;
    product: Product;
    journeyContext: JourneyContext;
};
