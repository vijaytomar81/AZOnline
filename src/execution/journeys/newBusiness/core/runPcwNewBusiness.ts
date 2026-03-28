// src/execution/journeys/newBusiness/core/runPcwNewBusiness.ts

import type { NewBusinessHandler } from "./types";
import { runDirectNewBusiness } from "./runDirectNewBusiness";

export const runPcwNewBusiness: NewBusinessHandler = async (args) => {
    await runDirectNewBusiness(args);
};
