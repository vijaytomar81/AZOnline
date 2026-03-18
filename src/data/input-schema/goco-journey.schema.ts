// src/data/data-builder/schemas/goco-journey.schema.ts

import type { DataSchema } from "./types";

export const gocoJourneySchema: DataSchema = {
    sheetName: "GoCoJourney",
    outputFile: "GoCoJourney.json",

    groups: {
        meta: [
            "Script ID",
            "Description",
            "Data Specification",
            "ScriptName",
        ],

        accountInformation: [
            "Account Id",
            "Password",
        ],

        carDetails: {
            vehicle: [
                "KnowRegNo",
                "VRN",
                "Make",
                "Model",
                "fuelType",
                "YearOfManufacture",
                "EngineSize",
                "Type",
                "Vehicle",
                "HasTheCarBeenModified",
                "MarketValue",
            ],

            owningAndUsingTheCar: [
                "PurchaseDate",
                "AreYouTheLegalOwnerOfTheCar",
                "AreYouTheRegKeeperOfTheCar",
                "WhatDoYouUseTheCarFor",
                "WhereIsTheCarParkedDuringTheDay",
                "WhereIsTheCarParkedOvernight",
                "Mileage",
                "BusinessMileage",
                "DoYouDriveTheCarInPeakTimes",
                "HowRegularlyDoYouDriveDuringPeakTimes",
            ],
        },

        policyHolder: {
            proposerDetails: [
                "Title",
                "Firstname",
                "Lastname",
                "DoB",
                "MaritalStatus",
                "HowLongHaveYouLivedInTheUK",
                "Phone",
                "AreYouAHomeowner",
                "HowManyChildrenDoYouHaveUnder16",
                "HouseNo",
                "Postcode",
                "IsTheCarKeptAtThisAddressOvernight",
                "CarParkedOvernightPostcode",
                "TotalNumberOfCarsInTheHousehold",
                "OccupationStatus",
                "JobTitle",
                "Sector",
                "AnyOtherEmployment",
                "OtherJob",
                "OtherJobSector",
            ],

            drivingDetails: [
                "LicenceType",
                "YearsSinceTestPassed",
                "AnyDVLAReportableMedicalCondition",
                "DVLAReportableMedicalCondition",
                "NoClaimBonusYears",
                "HaveAValidIAMCertificate",
                "PassPlusCertificate",
                "DoYouDriveAnyOtherVehicles",
                "OtherVehiclesYouDrive",
                "EnterDrivingLicenceNumber",
                "LicencePart1",
                "LicencePart2",
            ],

            claims: {
                countField: "ClaimsCount",
                enableField: "AnyClaimsInLast5Years",

                claimDetails: {
                    claim1: [
                        "Claim1Description",
                        "DateOfIncident1",
                        "DidTheClaimOccurOnYourMostRecentPolicy1",
                        "CostOfClaim1",
                    ],
                    claim2: [
                        "Claim2Description",
                        "DateOfIncident2",
                        "DidTheClaimOccurOnYourMostRecentPolicy2",
                        "CostOfClaim2",
                    ],
                    claim3: [
                        "Claim3Description",
                        "DateOfIncident3",
                        "DidTheClaimOccurOnYourMostRecentPolicy3",
                        "CostOfClaim3",
                    ],
                },
            },

            conviction: {
                countField: "ConvictionsCount",
                enableField: "Convictions",
                extraFields: [
                    "DoYouHaveAnyUnspentNonMotoringCriminalConvictions",
                ],

                convictionDetails: {
                    conviction1: [
                        "TypeOfConviction1",
                        "DateOfConviction1",
                        "WasThisRelatedToAnAccident1",
                        "DidYouHaveToPayAFine1",
                        "FineAmount1",
                        "HadPenalty1",
                        "PenaltyPoints1",
                        "DidYouReceiveADrivingBan1",
                        "BanPeriod1",
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

        coverDetails: [
            "CoverStartDay",
            "CoverStartFullDate",
            "WouldYouLikeARenewalReminder",
            "WhatCoverDoYouNeed",
            "VoluntaryExcess",
            "250FreeEexcessCover",
            "WantToProtectNCBonus",
            "HasAnInsurerEverDeclinedCancelledEtc",
            "WhatIsYourRenewalPrice",
            "breakDownOption",
            "RR",
            "PNCD",
            "GuaranteedHireCar",
            "MotorLegalExpenses",
            "Product",
            "DeclineMessage",
            "AthenaUWRuleID",
            "AthenaUWMessage",
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
            countField: "AdditionalDriversCount",
            prefixBase: "AD",
            max: 4,

            groups: {
                proposerDetails: [
                    "RelationToProposer",
                    "Title",
                    "MaritalStatus",
                    "Firstname",
                    "Lastname",
                    "DOB",
                    "HowLongHaveYouLivedInTheUK",
                    "OccupationStatus",
                    "JobTitle",
                    "JobSector",
                    "AnyOtherEmployment",
                    "OtherJob",
                    "OtherSector",
                ],

                drivingDetails: [
                    "LicenceType",
                    "HowLongHasItBeenSinceTheyPassedTheirTest",
                    "HaveIAMCertificate",
                    "DVLAReportableMedicalConditions",
                    "DoTheyDriveAnyOtherVehicle",
                    "SelectOtherVehiclesTheyDrive",
                    "EnterDrivingLicenceNumber",
                    "LicencePart1",
                    "LicencePart2",
                ],

                claims: {
                    countField: "ClaimsCount",
                    enableField: "HaveClaims",

                    claimDetails: {
                        claim1: [
                            "ClaimDescription1",
                            "DateOfIncident1",
                            "DidTheClaimOccurOnYourMostRecentPolicy1",
                            "CostOfClaim1",
                        ],
                        claim2: [
                            "ClaimDescription2",
                            "DateOfIncident2",
                            "DidTheClaimOccurOnYourMostRecentPolicy2",
                            "CostOfClaim2",
                        ],
                    },
                },

                conviction: {
                    countField: "ConvictionsCount",
                    enableField: "Convictions",
                    extraFields: [
                        "NonMotoringConvictions",
                    ],

                    convictionDetails: {
                        conviction1: [
                            "TypeOfConviction1",
                            "DateOfConviction1",
                            "WasThisRelatedToAnAccident1",
                            "DidYouHaveToPayAFine1",
                            "FineAmount1",
                            "HadPenalty1",
                            "PenaltyPoints1",
                            "DidYouReceiveADrivingBan1",
                            "BanPeriod1",
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
        "Data Specification",
        "ScriptName",
        "Account Id",
    ],
};