// src/configLayer/models/journeyContext.config.ts

export const JOURNEY_TYPES = {
    NEW_BUSINESS: "NewBusiness",
    MTA: "MTA",
    RENEWAL: "Renewal",
    MTC: "MTC",
} as const;

export type JourneyType =
    (typeof JOURNEY_TYPES)[keyof typeof JOURNEY_TYPES];

export const MTA_TYPES = {
    CHANGE_ADDRESS: "ChangeAddress",
    CHANGE_VEHICLE: "ChangeVehicle",
    ADD_DRIVER: "AddDriver",
    REMOVE_DRIVER: "RemoveDriver",
} as const;

export type MtaType =
    (typeof MTA_TYPES)[keyof typeof MTA_TYPES];

export type JourneyContext =
    | {
          type: typeof JOURNEY_TYPES.NEW_BUSINESS;
      }
    | {
          type: typeof JOURNEY_TYPES.RENEWAL;
      }
    | {
          type: typeof JOURNEY_TYPES.MTC;
      }
    | {
          type: typeof JOURNEY_TYPES.MTA;
          subType: MtaType;
      };
