// src/execution/core/bootstrap/createExecutionBootstrap.ts

import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";
import { emitLog } from "@logging/emitLog";
import {
    createExecutorRegistry,
    type ExecutorRegistry,
} from "@execution/core/registry";
import {
    createStepDataResolverRegistry,
    type StepDataResolverRegistry,
} from "@execution/runtime/resolveStepData";
import { registerDefaultExecutors } from "@execution/runtime/registerDefaults";
import { registerDefaultStepDataSources } from "./registerDefaultStepDataSources";

export type ExecutionBootstrap = {
    executorRegistry: ExecutorRegistry;
    stepDataRegistry: StepDataResolverRegistry;
};

export type BootstrapOptions = {
    registerDefaultSources?: boolean;
    registerDefaultExecutors?: boolean;
};

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

    emitLog({
        scope: "run",
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.FRAMEWORK,
        message: "Initializing execution bootstrap...",
    });

    emitLog({
        scope: "run",
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.FRAMEWORK,
        message: `Bootstrap options -> registerDefaultSources=${shouldRegisterDefaultSources(opts)}, registerDefaultExecutors=${shouldRegisterDefaultExecutors(opts)}`,
    });

    if (shouldRegisterDefaultSources(opts)) {
        registerDefaultStepDataSources(stepDataRegistry);

        emitLog({
            scope: "run",
            level: LOG_LEVELS.DEBUG,
            category: LOG_CATEGORIES.FRAMEWORK,
            message: "Default step data sources registered.",
        });

        emitLog({
            scope: "run",
            level: LOG_LEVELS.DEBUG,
            category: LOG_CATEGORIES.FRAMEWORK,
            message: `Step data source count=${stepDataRegistry.sources.length}`,
        });
    }

    if (shouldRegisterDefaultExecutors(opts)) {
        registerDefaultExecutors(bootstrap);

        emitLog({
            scope: "run",
            level: LOG_LEVELS.DEBUG,
            category: LOG_CATEGORIES.FRAMEWORK,
            message: "Default step executors registered.",
        });
    }

    emitLog({
        scope: "run",
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.FRAMEWORK,
        message: "Execution bootstrap ready.",
    });

    emitLog({
        scope: "run",
        level: LOG_LEVELS.DEBUG,
        category: LOG_CATEGORIES.FRAMEWORK,
        message: `Bootstrap summary -> executorKeys=${Object.keys(executorRegistry).length}, stepDataSources=${stepDataRegistry.sources.length}`,
    });

    return bootstrap;
}
