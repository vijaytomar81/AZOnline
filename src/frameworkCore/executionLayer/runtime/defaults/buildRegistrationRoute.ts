// src/frameworkCore/executionLayer/runtime/defaults/buildRegistrationRoute.ts

import type { ExecutorRegistration } from "./types";

export function buildRegistrationRoute(
    registration: ExecutorRegistration
): string {
    return [
        `action=${registration.action}`,
        registration.portal ? `portal=${registration.portal}` : "",
        registration.subType ? `subType=${registration.subType}` : "",
    ]
        .filter(Boolean)
        .join(", ");
}
