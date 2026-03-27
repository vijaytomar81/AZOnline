// src/execution/core/bootstrap.ts

import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";
import { createLogEvent, logEvent } from "@logging/log";
import {
    createExecutorRegistry,
    type ExecutorRegistry,
    type StepExecutor,
    registerExecutor,
} from "./registry";
import {
    createStepDataResolverRegistry,
    type StepDataResolverRegistry,
    type StepDataSource,
    registerStepDataSource,
} from "@execution/runtime/resolveStepData";
import { registerDefaultExecutors } from "@execution/runtime/registerDefaults";

export type ExecutionBootstrap = {
    executorRegistry: ExecutorRegistry;
    stepDataRegistry: StepDataResolverRegistry;
};

export type BootstrapOptions = {
    registerDefaultSources?: boolean;
    registerDefaultExecutors?: boolean;
};

function emitFrameworkLog(
    level: "debug" | "info" | "warn" | "error",
    message: string
): void {
    logEvent(createLogEvent({
        level,
        category: LOG_CATEGORIES.FRAMEWORK,
        message,
        scope: "run",
    }));
}

function registerDefaultStepDataSources(
    stepDataRegistry: StepDataResolverRegistry
): void {
    registerStepDataSource(stepDataRegistry, {
        action: "NewBusiness",
        journey: "Direct",
        sheetName: "FlowNB",
        schemaName: "direct",
    });
}

function shouldRegisterDefaultSources(opts: BootstrapOptions): boolean {
    return opts.registerDefaultSources !== false;
}

function shouldRegisterDefaultExecutors(opts: BootstrapOptions): boolean {
    return opts.registerDefaultExecutors !== false;
}

export function createExecutionBootstrap(
    opts: BootstrapOptions = {}
): ExecutionBootstrap {
    const executorRegistry = createExecutorRegistry();
    const stepDataRegistry = createStepDataResolverRegistry();

    const bootstrap: ExecutionBootstrap = {
        executorRegistry,
        stepDataRegistry,
    };

    emitFrameworkLog(
        LOG_LEVELS.DEBUG,
        "Initializing execution bootstrap..."
    );
    emitFrameworkLog(
        LOG_LEVELS.DEBUG,
        `Bootstrap options -> registerDefaultSources=${shouldRegisterDefaultSources(opts)}, registerDefaultExecutors=${shouldRegisterDefaultExecutors(opts)}`
    );

    if (shouldRegisterDefaultSources(opts)) {
        registerDefaultStepDataSources(stepDataRegistry);
        emitFrameworkLog(
            LOG_LEVELS.DEBUG,
            "Default step data sources registered."
        );
        emitFrameworkLog(
            LOG_LEVELS.DEBUG,
            `Step data source count=${stepDataRegistry.sources.length}`
        );
    }

    if (shouldRegisterDefaultExecutors(opts)) {
        registerDefaultExecutors(bootstrap);
        emitFrameworkLog(
            LOG_LEVELS.DEBUG,
            "Default step executors registered."
        );
    }

    emitFrameworkLog(LOG_LEVELS.DEBUG, "Execution bootstrap ready.");
    emitFrameworkLog(
        LOG_LEVELS.DEBUG,
        `Bootstrap summary -> executorKeys=${Object.keys(executorRegistry).length}, stepDataSources=${stepDataRegistry.sources.length}`
    );

    return bootstrap;
}

export function addStepDataSource(
    bootstrap: ExecutionBootstrap,
    source: StepDataSource
): void {
    registerStepDataSource(bootstrap.stepDataRegistry, source);

    emitFrameworkLog(
        LOG_LEVELS.DEBUG,
        `Step data source added for action=${source.action}, sheet=${source.sheetName}`
    );
    emitFrameworkLog(
        LOG_LEVELS.DEBUG,
        `Step data source -> action=${source.action}, journey=${source.journey ?? ""}, subType=${source.subType ?? ""}, schema=${source.schemaName ?? ""}, sheet=${source.sheetName}`
    );
}

export function addStepExecutor(args: {
    bootstrap: ExecutionBootstrap;
    action: string;
    journey?: string;
    portal?: string;
    subType?: string;
    executor: StepExecutor;
}): void {
    registerExecutor(args.bootstrap.executorRegistry, {
        action: args.action,
        journey: args.journey,
        portal: args.portal,
        subType: args.subType,
        executor: args.executor,
    });

    const route = [
        `action=${args.action}`,
        args.journey ? `journey=${args.journey}` : "",
        args.portal ? `portal=${args.portal}` : "",
        args.subType ? `subType=${args.subType}` : "",
    ].filter(Boolean).join(", ");

    emitFrameworkLog(LOG_LEVELS.DEBUG, `Step executor added for ${route}`);
    emitFrameworkLog(
        LOG_LEVELS.DEBUG,
        `Executor registry size=${Object.keys(args.bootstrap.executorRegistry).length}`
    );
}