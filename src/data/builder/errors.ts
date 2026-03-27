// src/data/builder/errors.ts

import { AppError, type AppErrorArgs } from "@utils/errors";

export class DataBuilderError extends AppError {
    constructor(args: AppErrorArgs) {
        super(args);
        this.name = "DataBuilderError";
    }
}