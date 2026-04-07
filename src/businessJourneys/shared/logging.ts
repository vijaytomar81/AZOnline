// src/businessJourneys/shared/logging.ts

export function logBusinessJourneyInfo(args: {
    scope: string;
    message: string;
}) {
    console.log(`[business-journey] [${args.scope}] ${args.message}`);
}
