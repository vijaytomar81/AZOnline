// src/utils/errors.ts

export type AppErrorArgs = {
    message: string;
    code?: string;
    stage?: string;
    source?: string;
    context?: Record<string, unknown>;
};

export class AppError extends Error {
    readonly code?: string;
    readonly stage?: string;
    readonly source?: string;
    readonly context?: Record<string, unknown>;

    constructor(args: AppErrorArgs) {
        super(args.message);
        this.name = "AppError";
        this.code = args.code;
        this.stage = args.stage;
        this.source = args.source;
        this.context = args.context;
    }
}