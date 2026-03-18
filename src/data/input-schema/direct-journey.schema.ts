// src/data/input-schema/direct-journey.schema.ts

import type { DataSchema } from "./types";

export const directJourneySchema: DataSchema = {
    sheetName: "DirectJourney",
    outputFile: "DirectJourney.json",

    groups: {
        meta: {
            scriptId: "Script ID",
            description: "Description",
            dataSpecification: "Data Specification",
            script: "Script",
            scriptName: "ScriptName",
        },

        accountInformation: {
            accountId: "Account Id",
            password: "Password",
            gmailPassword: "gmailPassword",
        },

        carDetails: {
            vehicle: {
                registrationKnown: "KnowRegNo",
                registrationNumber: "VRN",
                make: "Make",
                yearOfManufacture: "YearOfManufacture",
                transmission: "Transmission",
                fuelType: "FuelType",
                service: "Service",
                bodyType: "BodyType",
                model: "Model",
                selectedCar: "SelectTheCar",
                registerNumber: "RegisterNumber",
                hasTrackingDevice: "HaveTrackingDevice",
                hasModifications: "DoesCarHaveModifications",
            },

            ownership: {
                purchaseDate: "PurchaseDate",
                hasBoughtCar: "HasTheCarBeenBought",
                policyHolderIsRegKeeperAndLegalOwner: "IsPHRegKeeperLegalOwner",
                registeredKeeper: "RegKeeper",
                legalOwner: "LegalOwner",
            },

            usage: {
                mainDriver: "whoIsMainDriver",
                annualMileage: "Mileage",
                storedAtHomeAddress: "IsVehicleStoredAtHomeAddress",
                daytimeParkingLocation: "CarStoredPlace",
                overnightParkingLocation: "CarStoredOvernightLocation",
                carsAtHome: "NoOfCarsAtHome",
                usageType: "CarUsageType",
            },
        },

        policyHolder: {
            identity: {
                title: "Title",
                firstName: "Firstname",
                lastName: "Lastname",
                fullName: "FullName",
                dobDerivation: "PHDoB Derivation",
                dateOfBirth: "DOB",
            },

            address: {
                houseNumber: "HouseNo",
                postcode: "Postcode",
                addressLine: "Address",
            },

            personalDetails: {
                employmentStatus: "EmploymentStatus",
                occupation: "Occupation",
                industry: "Industry",
                hasSecondaryOccupation: "HaveSecondaryOccupation",
                maritalStatus: "MaritalStatus",
                phone: "Phone",
                homeOwnership: "DoYouOwnYourHome",
                ukResidentMoreThan3Years: "UKRresidentForMoreThan3Years",
                ukResidentYears: "UKResidentYears",
                lvMemberAnswer: "LVMemberAnswer",
            },

            licenceDetails: {
                enterDriverDetailsManually: "EnterDriverDetailsManually",
                haveDrivingLicenceHandy: "HaveDrivingLicenceHandy",
                licencePart1: "LicencePart1",
                licencePart2: "LicencePart2",
                licenceNumber: "LicenceNumber",
                licenceType: "LicenceType",
                licenceHeldYears: "LicenceHeldYears ",
            },

            drivingHistory: {},

            ncdDetails: {
                ncdYears: "NCDYears",
                howWasNCDEarned: "HowWasNCDEarned",
                wantToProtectNCD: "WantToProtectNCD",
            },

            convictions: {
                countField: "ConvictionsCount",
                enableField: "HaveMotoringConvictions",

                convictionDetails: {
                    conviction1: {
                        date: "Conviction1Date",
                        code: "Conviction1Code",
                        resultedInDisqualification: "DidConviction1ResultInDisqualification",
                        banLength: "Conviction1BanLength",
                    },
                    conviction2: {
                        date: "Conviction2Date",
                        code: "Conviction2Code",
                        resultedInDisqualification: "DidConviction2ResultInDisqualification",
                        banLength: "Conviction2BanLength",
                    },
                    conviction3: {
                        date: "Conviction3Date",
                        code: "Conviction3Code",
                        resultedInDisqualification: "DidConviction3ResultInDisqualification",
                        banLength: "Conviction3BanLength",
                    },
                },
            },

            claims: {
                countField: "ClaimsCount",
                enableField: "HadClaimsAnswer",
                extraFields: ["HaveNonMotoringConviction"],

                claimDetails: {
                    claim1: {
                        date: "Claim1Date",
                        reason: "Claim1Reason",
                    },
                    claim2: {
                        date: "Claim2Date",
                        reason: "Claim2Reason",
                    },
                    claim3: {
                        date: "Claim3Date",
                        reason: "Claim3Reason",
                    },
                },
            },
        },

        coverDetails: {
            coverStartDay: "CoverStartDay",
            coverStartFullDate: "CoverStartFullDate",
            voluntaryExcess: "VoluntaryExcess",
            breakDownOption: "breakDownOption",
            renewalReminder: "RR",
            protectedNoClaimsDiscount: "PNCD",
            guaranteedHireCar: "GuaranteedHireCar",
            motorLegalExpenses: "MotorLegalExpenses",
            product: "Product",
            declineMessage: "DeclineMessage",
            athenaUWRuleId: "AthenaUWRuleID",
            athenaUWMessage: "AthenaUWMessage",
            proceedToBuy: "ProceedToBuy",
        },

        directDebitDetails: {
            bankCheckService: "BankCheckService",
            accountHolderName: "AccountHolderName",
            accountNumber: "AccountNumber",
            sortCode: "SortCode",
            paymentDay: "PaymentDay",
        },

        paymentDetails: {
            paymentGatewayService: "PaymentGatewayService",
            paymentMode: "PaymentMode",
            lowRange: "LowRange",
            highRange: "HighRange",
            paymentDate: "PaymentDate",
            cardName: "CardName",
            cardNumber: "CardNumber",
            expiryMonth: "ExpiryMM",
            expiryYear: "ExpiryYYYY",
            securityCode: "SecurityCode",
            monthlyCardCase: "MonthlyCardCase",
        },
    },

    repeatedGroups: {
        additionalDrivers: {
            countField: "AdditionalDriversCount",
            prefixBase: "AD",
            max: 5,

            groups: {
                identity: {
                    title: "Title",
                    firstName: "Firstname",
                    lastName: "Lastname",
                    dobDerivation: "DoB Derivation",
                    dateOfBirth: "DOB",
                },

                address: {
                    houseNumber: "HouseNo",
                    postcode: "Postcode",
                },

                personalDetails: {
                    employmentStatus: "EmploymentStatus",
                    occupation: "Occupation",
                    industry: "Industry",
                    maritalStatus: "MaritalStatus",
                    hasSecondaryOccupation: "HaveSecOccupation",
                    relationToPolicyHolder: "RelationToPH",
                    isUKResident: "IsUKResident",
                    ukResidentYears: "UKResidentYears",
                    homeOwnership: "DoYouOwnYourHome",
                    ownsAnotherVehicle: "DoesDriverOwnAnotherVehicle",
                    lvMemberAnswer: "LVMemberAnswer",
                },

                licenceDetails: {
                    enterDriverDetailsManually: "EnterDriverDetailsManually",
                    haveDrivingLicenceHandy: "HaveDrivingLicenceHandy",
                    licenceNumber: "LicenceNumber",
                    licencePart1: "LicencePart1",
                    licencePart2: "LicencePart2",
                    licenceType: "LicenceType",
                    licenceExperience: "LicenceExperience",
                },

                drivingHistory: {},

                ncdDetails: {
                    ncdYears: "NCDYears",
                    howWasNCDEarned: "HowWasNCDEarned",
                    wantToProtectNCD: "DoYouWantToProctectNCD",
                },

                convictions: {
                    countField: "ConvictionsCount",
                    enableField: "HaveMotoringConvictions",

                    convictionDetails: {
                        conviction1: {
                            date: "Conviction1Date",
                            code: "Conviction1Code",
                            resultedInDisqualification: "DidConviction1ResultInDisqualification",
                            banLength: "Conviction1BanLength",
                        },
                        conviction2: {
                            date: "Conviction2Date",
                            code: "Conviction2Code",
                            resultedInDisqualification: "DidConviction2ResultInDisqualification",
                            banLength: "Conviction2BanLength",
                        },
                        conviction3: {
                            date: "Conviction3Date",
                            code: "Conviction3Code",
                            resultedInDisqualification: "DidConviction3ResultInDisqualification",
                            banLength: "Conviction3BanLength",
                        },
                    },
                },

                claims: {
                    countField: "ClaimsCount",
                    enableField: "HadClaimsAnswer",

                    claimDetails: {
                        claim1: {
                            date: "Claim1Date",
                            reason: "Claim1Reason",
                        },
                        claim2: {
                            date: "Claim2Date",
                            reason: "Claim2Reason",
                        },
                        claim3: {
                            date: "Claim3Date",
                            reason: "Claim3Reason",
                        },
                    },
                },
            },
        },
    },

    requiredFields: [
        "Script ID",
        "Description",
        "Data Specification",
        "Script",
        "ScriptName",
        "Account Id",
    ],
};