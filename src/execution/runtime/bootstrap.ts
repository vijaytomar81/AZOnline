// src/execution/runtime/bootstrap.ts

import { createLogger, type Logger } from "../../utils/logger";
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
} from "./resolveStepData";
import { registerDefaultExecutors } from "./registerDefaults";

export type ExecutionBootstrap = {
    log: Logger;
    executorRegistry: ExecutorRegistry;
    stepDataRegistry: StepDataResolverRegistry;
};

export type BootstrapOptions = {
    log?: Logger;
    registerDefaultSources?: boolean;
    registerDefaultExecutors?: boolean;
};

function createBootstrapLogger(log?: Logger): Logger {
    return log ?? createLogger({ prefix: "[execution]", logLevel: "info" });
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

export function createExecutionBootstrap(
    opts: BootstrapOptions = {}
): ExecutionBootstrap {
    const log = createBootstrapLogger(opts.log);
    const executorRegistry = createExecutorRegistry();
    const stepDataRegistry = createStepDataResolverRegistry();

    const bootstrap: ExecutionBootstrap = {
        log,
        executorRegistry,
        stepDataRegistry,
    };

    log.info("Initializing execution bootstrap...");
    log.debug(
        `Bootstrap options -> registerDefaultSources=${opts.registerDefaultSources !== false}, ` +
        `registerDefaultExecutors=${opts.registerDefaultExecutors !== false}`
    );

    if (opts.registerDefaultSources !== false) {
        registerDefaultStepDataSources(stepDataRegistry);
        log.info("Default step data sources registered.");
        log.debug(`Step data source count=${stepDataRegistry.sources.length}`);
    }

    if (opts.registerDefaultExecutors !== false) {
        registerDefaultExecutors(bootstrap);
        log.info("Default step executors registered.");
    }

    log.info("Execution bootstrap ready.");
    log.debug(
        `Bootstrap summary -> executorKeys=${Object.keys(executorRegistry).length}, ` +
        `stepDataSources=${stepDataRegistry.sources.length}`
    );

    return bootstrap;
}

export function addStepDataSource(
    bootstrap: ExecutionBootstrap,
    source: StepDataSource
): void {
    registerStepDataSource(bootstrap.stepDataRegistry, source);

    bootstrap.log.info(
        `Step data source added for action=${source.action}, sheet=${source.sheetName}`
    );
    bootstrap.log.debug(
        `Step data source -> action=${source.action}, journey=${source.journey ?? ""}, ` +
        `subType=${source.subType ?? ""}, schema=${source.schemaName ?? ""}, ` +
        `sheet=${source.sheetName}`
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
    ]
        .filter(Boolean)
        .join(", ");

    args.bootstrap.log.info(`Step executor added for ${route}`);
    args.bootstrap.log.debug(`Executor registry size=${Object.keys(args.bootstrap.executorRegistry).length}`);
}