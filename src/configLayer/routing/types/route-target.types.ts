// src/configLayer/routing/types/route-target.types.ts

import type { Platform } from "../../models/platform.config";

export type RouteTarget = {
    platform: Platform;
    url: string;
};
