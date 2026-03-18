import { directJourneySchema } from "./direct-journey.schema";
import { cnfJourneySchema } from "./cnf-journey.schema";
import { ctmJourneySchema } from "./ctm-journey.schema";
import { gocoJourneySchema } from "./goco-journey.schema";
import { msmJourneySchema } from "./msm-journey.schema";

import type { DataSchema } from "./types";

export const inputSchemas: Record<string, DataSchema> = {
    direct: directJourneySchema,
    cnf: cnfJourneySchema,
    ctm: ctmJourneySchema,
    goco: gocoJourneySchema,
    msm: msmJourneySchema,
};