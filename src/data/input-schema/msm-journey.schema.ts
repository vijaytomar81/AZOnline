// src/data/data-builder/schemas/msm-journey.schema.ts

import type { DataSchema } from "./types";

export const msmJourneySchema: DataSchema = {
    sheetName: "MSMJourney",
    outputFile: "MSMJourney.json",

    groups: {
        meta: [
            "Script ID",
            "Description",
            "Result",
            "ScriptName",
        ],

        accountInformation: [
            "Username",
            "Password",
        ],

        carDetails: {
            yourCar: [
                "KnowRegNo",
                "VRN",
                "whatIsTheMake",
                "makeOtherChoice",
                "whichModel",
                "whatFuelType",
                "isItManualOrAutomatic",
                "yearRegistered",
                "engineSize",
                "VersionTrimIsIt",
                "WhichOfTheseCarIsIt",
                "worthOfTheCar",
                "AreTheseDetailsCorrect",
                "HasTheCarBeenModified",
                "DoYouHaveTheCarYet",
                "WhenDidYouBuyTheCar",
                "AreYouTheOwnerAndRegisteredKeeper",
                "WhoIsTheOwnerOfTheCar",
                "WhoIsTheRegisteredKeeperOfTheCar",
            ],

            carUsageDetails: [
                "HowDoYouUseTheCar",
                "WhoUsesTheCarForBusiness",
                "HowManyBusinessMilesDoes",
                "HowManyPersonalMilesDoes",
                "WhereIsTheCarKeptDuringTheDay",
                "SelectLocation",
                "WhereIsTheCarKeptAtNight",
                "SelectLocation1",
                "DoYouDriveAnyOtherCars",
                "WhichOfTheseDoYouDrive",
            ],
        },

        policyHolder: {
            yourDetails: [
                "Title",
                "Firstname",
                "Lastname",
                "DOB",
                "Are you:",
                "Postcode",
                "PleaseSelectAddress",
                "AreYouAHomeowner",
                "HowLongHaveYouLivedInUK",
                "RelationshipStatus",
                "HowManyChildrenDoYouHaveUnder16",
                "WhatDoYouDo",
                "WhatJobDoYouDo",
                "WhichIndustryDoYouWorkIn",
                "DoYouDoAnyOtherWork",
                "WhatOtherJobDoYouDo",
                "WhichIndustryIsYourOtherJobIn",
                "WhatKindOfStudentAreYou",
                "WhichOfTheseDescribesYouBest",
                "HowManyCarsAreThereInYourHousehold",
            ],

            licenceDetails: [
                "WhichKindOfDrivingLicenceDoYouHave",
                "WhereWasYourLicenceIssued",
                "LicenceCoversManualCarOrAutomatics",
                "DoHaveAdditionalDrivingQualifications",
                "WhichQualificationDoYouHave",
                "HowLongDoesTheRestrictionLast",
                "AnyDVLAForMedicalAndDisabilities",
                "DoesTheDVLAKnowAboutTheseMedicalConditions",
                "LicenceNumber",
                "YearsHeldYourCurrentLicence",
            ],

            claims: {
                countField: "ClaimsCount",
                enableField: "HaveAnyAccidentsClaimsLossesInLastFiveYears",

                claimDetails: {
                    claim1: [
                        "WhatKindOfIncidentOrClaimWasIt",
                        "ClaimOtherOptions",
                        "WhoWasAtFault",
                        "WhenDidTheIncidentHappen",
                        "DidThisClaimAffectYourNoClaimsDiscount",
                        "whatWasStolen",
                    ],
                    claim2: [],
                    claim3: [],
                },
            },

            conviction: {
                countField: "ConvictionsCount",
                enableField: "HaveAnyDrivingOffencesOrPenaltyInLast5Years",
                extraFields: [
                    "DoYouHaveAnyUnspentNon-DrivingConvictions",
                    "DoTheyDriveAnyCars",
                ],

                convictionDetails: {
                    conviction1: [
                        "WhatKindOfOffenceWasIT",
                        "DVLAOffenceCode",
                        "WhenDidOffenceIncidentHappen",
                        "HowManyPenaltyPointsForOffence",
                        "PenaltyPointsOthers",
                        "DidYouPayAFine",
                        "HowMuchWasIt",
                        "WereYouBannedFromDriving",
                        "HowLongYouWereBanned",
                    ],
                    conviction2: [],
                    conviction3: [],
                },
            },
        },

        yourPolicyDetails: [
            "WhoWillBeTheMainDriver",
            "AdditionalDriverInsuranceDeclinedCencelled",
            "WhatTypeOfCoverDoYouNeed",
            "HowMuchVoluntryExcess",
            "HowManyYearsOfNoClaimsDiscount",
            "WouldYouLikeToProtectYourNoClaimsDiscount",
            "HowWouldYouLikeToPay",
            "HowNormallyPayYourCarInsurance",
            "WhenWouldYouLikeYourInsuranceToStart",
        ],

        optionalExtras: [
            "LegalCover",
            "PersonalInjuryCover",
            "BreakdownCover",
            "CourtesyCarCover",
        ],

        gettingTouchWith: [
            "YourEmailAddress",
            "ConfirmYourEmailAddress",
            "Iagree",
        ],

        coverDetails: [
            "CoverStartDay",
            "CoverStartFullDate",
            "CoverType",
            "VoluntaryExcess",
            "breakDownOption",
            "RR",
            "PNCD",
            "GuaranteedHireCar",
            "MotorLegalExpenses",
            "Product",
            "DeclineMessage",
            "ProceedToBuy",
        ],

        directDebitDetails: [
            "BankCheckService",
            "AccountHolderName",
            "AccountNumber",
            "SortCode",
            "PaymentDay",
        ],

        paymentDetails: [
            "PaymentGatewayService",
            "PaymentMode",
            "LowRange",
            "HighRange",
            "PaymentDate",
            "CardName",
            "CardNumber",
            "ExpiryMM",
            "ExpiryYYYY",
            "SecurityCode",
            "MonthlyCardCase",
        ],
    },

    repeatedGroups: {
        additionalDrivers: {
            enableField: "LikeToAddAdditionalDrivers",
            countField: "AdditionalDriversCount",
            prefixBase: "AD",
            max: 5,

            groups: {
                personalDetails: [
                    "Title",
                    "FirstName",
                    "LastName",
                    "DOB",
                    "Gender",
                    "RelationshipToYou",
                    "RelationshipToYouOther",
                    "WhatTypeOfRelationshipAreTheyIn",
                    "WhatDoTheyDo",
                    "WhatJobDoTheyDo",
                    "WhichIndustryDoTheyWorkIn",
                    "DoTheyDoAnyOtherWork",
                    "WhatOtherJobDoTheyDo",
                    "WhichIndustryTheirOtherJobIn",
                    "HowLongHaveTheyLivedInUK",
                    "WhatKindOfStudentAreThey",
                    "WhichOfTheseDescribesThemBestOtherOption",
                ],

                licenceDetails: [
                    "WhichKindOfDrivingLicenceDoTheyHave",
                    "WhereWasTheirLicenceIssued",
                    "HowLongDoesTheRestrictionLast",
                    "LicenceCoverManualOrAutomatics",
                    "AnyAdditionalDrivingQualifications",
                    "WhichQualificationDoTheyHave",
                    "KnowTheirLicenceNumber",
                    "LicenceNumber",
                    "HowManyYearsHeldTheirLicence",
                    "AnyMedicalConditionsDisabilitiesToDVLA",
                    "DoesTheDVLAKnowMedicalConditions",
                ],

                drivingUsage: [
                    "DoTheyDriveAnyOtherCars",
                    "WhichOfTheseDoTheyDrive",
                ],

                claims: {
                    countField: "ClaimsCount",
                    enableField: "AnyMotorAccidentClaimsLossesInLast5Years",

                    claimDetails: {
                        claim1: [
                            "WhatKindOfIncidentOrClaimWasIt",
                            "WhoWasAtFault",
                            "WhatWasStolen",
                            "WhenDidTheIncidentHappen",
                            "ClaimOtherOptions",
                            "DidThisClaimAffectTheirNoClaimDiscount",
                        ],
                        claim2: [
                            "ClaimDescription2",
                            "DateOfIncident2",
                            "DidTheClaimOccurOnYourMostRecentPolicy2",
                            "CostOfClaim2",
                        ],
                        claim3: [],
                    },
                },

                conviction: {
                    countField: "ConvictionsCount",
                    enableField: "HaveTheyCommittedAnyDrivingOffencePenaliyIn5years",
                    extraFields: [
                        "AnyUnSpentNonDrivingConvictions",
                    ],

                    convictionDetails: {
                        conviction1: [
                            "WhatKindOfOffenceWasIT",
                            "WhatIsTheDLVAOffenceCodeSpeedyOption",
                            "WhatIsTheDLVAOffenceCodeTextBox",
                            "WhenDidTheOffenceIncidentHappen",
                            "HowManyPenaltyPointsForOffence",
                            "HowManyPenaltyPointsForOffenceTextbox",
                            "DidTheyPayAFine",
                            "HowMuchFineAmount",
                            "WereTheyBannedFromDriving",
                            "HowLongWereTheyBanned",
                        ],
                        conviction2: [
                            "TypeOfConviction2",
                            "DateOfConviction2",
                            "WasThisRelatedToAnAccident2",
                            "DidYouHaveToPayAFine2",
                            "FineAmount2",
                            "HadPenalty2",
                            "PenaltyPoints2",
                            "DidYouReceiveADrivingBan2",
                            "BanPeriod2",
                        ],
                        conviction3: [
                            "TypeOfConviction3",
                            "DateOfConviction3",
                            "WasThisRelatedToAnAccident3",
                            "DidYouHaveToPayAFine3",
                            "FineAmount3",
                            "HadPenalty3",
                            "PenaltyPoints3",
                            "DidYouReceiveADrivingBan3",
                            "BanPeriod3",
                        ],
                    },
                },
            },
        },
    },

    requiredFields: [
        "Script ID",
        "Description",
        "Result",
        "ScriptName",
        "Username",
    ],
};