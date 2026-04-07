// src/businessJourneys/shared/types.ts

export type BusinessJourneyRoute = {
    application: string;
    product: string;
    journey: string;
    entryPoint: string;
    startUrl: string;
};

export type BusinessJourneyContext = {
    page: any;
    pageActionContext: any;
    pageActions: typeof import("@pageActions");
    logScope: string;
};

export type JourneyStepArgs<TData = unknown> = {
    context: BusinessJourneyContext;
    route: BusinessJourneyRoute;
    data: TData;
};

export type JourneyStep<TData = unknown> = {
    stepKey: string;
    shouldRun?: (args: JourneyStepArgs<TData>) => boolean | Promise<boolean>;
    run: (args: JourneyStepArgs<TData>) => Promise<void>;
};

export type BusinessJourney<TData = unknown> = {
    journeyKey: string;
    matches: (args: {
        application: string;
        product: string;
        journey: string;
    }) => boolean;
    run: (args: {
        context: BusinessJourneyContext;
        route: BusinessJourneyRoute;
        data: TData;
    }) => Promise<void>;
};
