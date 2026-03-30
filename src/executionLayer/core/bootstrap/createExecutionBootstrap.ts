// src/executionLayer/core/bootstrap/createExecutionBootstrap.ts

import { LOG_CATEGORIES } from "@logging/core/logCategories";
import { LOG_LEVELS } from "@logging/core/logLevels";
import { emitLog } from "@logging/emitLog";
import {
    createExecutorRegistry,
    type ExecutorRegistry,
} from "@executionLayer/core/registry";
import {
    createExecutionItemDataRegistry,
    type ExecutionItemDataRegistry,
} from "@executionLayer/runtime/itemData";
import { registerDefaultExecutionItemSources } from "./registerDefaultExecutionItemSources";
import type {
    ExecutionBootstrap,
    ExecutionBootstrapOptions,
} from "./types";

function shouldRegisterDefaultSources(
    opts: ExecutionBootstrapOptions
): boolean {
    return opts.registerDefaultSources !== false;
}

export function createExecutionBootstrap(
    opts: ExecutionBootstrapOptions = {}
): ExecutionBootstrap {
    const executorRegistry: ExecutorRegistry = createExecutorRegistry();
    const executionItemDataRegistry: ExecutionItemDataRegistry =
        createExecutionItemDataRegistry();

    const bootstrap: ExecutionBootstrap = {
        executorRegistry,
        executionItemDataRegistry,
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
        message: `Bootstrap options -> registerDefaultSources=${shouldRegisterDefaultSources(opts)}`,
    });

    if (shouldRegisterDefaultSources(opts)) {
        registerDefaultExecutionItemSources(executionItemDataRegistry);

        emitLog({
            scope: "run",
            level: LOG_LEVELS.DEBUG,
            category: LOG_CATEGORIES.FRAMEWORK,
            message: "Default execution item sources registered.",
        });

        emitLog({
            scope: "run",
            level: LOG_LEVELS.DEBUG,
            category: LOG_CATEGORIES.FRAMEWORK,
            message: `Execution item source count=${executionItemDataRegistry.sources.length}`,
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
        message: `Bootstrap summary -> executorKeys=${Object.keys(executorRegistry).length}, executionItemSources=${executionItemDataRegistry.sources.length}`,
    });

    return bootstrap;
}
