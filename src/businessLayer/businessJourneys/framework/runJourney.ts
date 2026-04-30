// src/businessLayer/businessJourneys/framework/runJourney.ts

export async function runJourney(args: {
    steps: Array<() => Promise<void>>;
}): Promise<void> {
    for (const step of args.steps) {
        await step();
    }
}
