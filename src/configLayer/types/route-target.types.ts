// src/config/types/route-target.types.ts

export type RouteStartKind = "Direct" | "PCW" | "PCWTool";

export type RouteTarget = {
    kind: RouteStartKind;
    url: string;
};
