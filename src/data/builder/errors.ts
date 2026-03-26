// src/data/builder/errors.ts

import { AppError, type AppErrorArgs } from "@utils/errors";

export class DataBuilderError extends AppError {
    constructor(args: AppErrorArgs) {
        super(args);
        this.name = "DataBuilderError";
    }
}

export function isDataBuilderError(error: unknown): error is DataBuilderError {
    return error instanceof DataBuilderError;
}