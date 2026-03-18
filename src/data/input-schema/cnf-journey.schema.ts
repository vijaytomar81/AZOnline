// src/data/input-schema/cnf-journey.schema.ts

import type { DataSchema } from "./types";

export const cnfJourneySchema: DataSchema = {
    sheetName: "CNF",
    outputFile: "CNF.json",

    groups: {
        meta: {
            scriptId: "Script ID",
            description: "Description",
            dataSpecification: "Data Specification",
            scriptName: "ScriptName",
        },

        accountInformation: {
            accountEmail: "AccountEmail",
            todaysDate: "Today'sDate",
            formattedDate: "Formatted Date",
            formattedAccountId: "Formatted AccountId",
            accountId: "Account Id",
            password: "Password",
            gmailPassword: "gmailPassword",
            title: "Title",
            firstName: "Firstname",
            lastName: "Lastname",
            fullName: "FullName",
        },

        carDetails: {
            vehicle: {
                registrationKnown: "KnowRegNo",
                registrationNumber: "VRN",
                make: "Make",
                model: "Model",
                yearOfManufacture: "YearOfManufacture",
                doors: "Doors",
                transmission: "Transmission",
                fuelType: "FuelType",
                engineSize: "EngineSize",
                trim: "Trim",
                marketValue: "HowMuchIsTheCarWorth",
                registerNumber: "RegisterNumber",
                imported: "HasTheCarBeenImported",
                driveSide: "IsTheCarRighthandOrLefthandDrive",
                seats: "HowManySeatsDoesVehicleHave",
                alarmOrImmobiliser: "DoesCarHaveAlarmOrImmobiliser",
                tracker: "DoesCarHaveTracker",
                modifications: "DoesCarHaveModifications",
                dashcamFitted: "DoesCarHaveDashcamFitted",
                vehicleHaveAnyModifications: "VehicleHaveAnyModifications",
            },

            ownership: {
                purchaseDate: "PurchaseDate",
                registeredKeeper: "RegKeeper",
            },

            usage: {
                usageReasonConfused: "CarUsageReasonConfused",
                usageReasonFlowCtm: "CarUsageReasonFlow&CTM",
                annualMileageFlow: "FlowMileage",
                annualMileageConfusedCtm: "ConfusedAndCTMMileage",
                storedAtSameLocation: "IsVehicleStoredAtSameLocation",
                daytimeParkingLocation: "CarStoredDaytimeLocation",
                overnightParkingLocation: "CarStoredOvernightLocation",
                parkingPlace: "CarParkPlace",
                carsAtHome: "NoOfCarsAtHome",
            },
        },

        policyHolder: {
            identity: {
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
                maritalStatus: "MaritalStatus",
                homeOwnership: "DoYouOwnYourHome",
                useAnotherVehicle: "DoYouUseAnotherVehicle",
                otherVehicleUsage: "HowDoYouUseTheOtherVehicle",
                ukResidentSince: "UKResidentSince",
                haveChildrenUnder16: "HaveChildrenUnder16",
                phone: "Phone",
                lvMemberAnswer: "LVMemberAnswer",
            },

            licenceDetails: {
                enterDriverDetailsManually: "EnterDriverDetailsManually",
                enterDriverLicenceNoConfused: "confusedenterDriverLicenceNo",
                licenceForManualOrAutomatic: "LicenceForManualOrAutomatic",
                licenceIssuedLocation: "LicenceIssuedLocation",
                licenceType: "LicenceType",
                licenceNumber: "LicenceNumber",
                licencePart1: "LicencePart1",
                licencePart2: "LicencePart2",
                confusedLicencePart3: "ConfusedLicencePart3",
                confusedLicencePart4: "ConfusedLicencePart4",
                licenceHeldYears: "LicenceHeldYears",
            },

            drivingHistory: {
                passedAdditionalDrivingQualifications: "PassedAdditionalDrivingQualifications",
                heldCarInsuranceInLast2Years: "HaveYouHeldCarInsuranceInLast2Years",
                regularlyDrivenCarNotInsured: "HasRegularlyDrivenCarNotInsured",
            },

            ncdDetails: {
                ncdYears: "NCDYears",
                howWasNCDEarned: "HowWasNCDEarned",
                wantToProtectNCD: "DoYouWantToProctectNCD",
                isNCDProtected: "IsNCDProtected",
            },

            claims: {
                countField: "howManyClaims",
                enableField: "HadClaimsAnswer",

                claimDetails: {
                    claim1: {
                        incidentType: "whatTypeOfIncidentWasIt1",
                        incidentOtherOption: "ClaimMoreOption1",
                        settled: "wasItSettled1",
                        anybodyInjured: "wasAnyBodyInjured1",
                        atFault: "whoWasAtFault1",
                        singleVehicleAccident: "wasItSingleVehicleAccident1",
                        incidentDate: "DateOfIncident1",
                        vehicleLocation: "whereWasTheVehicle1",
                        stolenItem: "whatWasStolen1",
                        vehicleRecovered: "wasTheVehicleRecovered1",
                        totalClaimCost: "TotalClaimCost1",
                    },
                    claim2: {
                        incidentType: "whatTypeOfIncidentWasIt2",
                        incidentOtherOption: "ClaimMoreOption2",
                        settled: "wasItSettled2",
                        anybodyInjured: "wasAnyBodyInjured2",
                        atFault: "whoWasAtFault2",
                        singleVehicleAccident: "wasItSingleVehicleAccident2",
                        incidentDate: "DateOfIncident2",
                        vehicleLocation: "whereWasTheVehicle2",
                        stolenItem: "whatWasStolen2",
                        vehicleRecovered: "wasTheVehicleRecovered2",
                        totalClaimCost: "TotalClaimCost2",
                    },
                    claim3: {
                        incidentType: "whatTypeOfIncidentWasIt3",
                        incidentOtherOption: "ClaimMoreOption3",
                        settled: "wasItSettled3",
                        anybodyInjured: "wasAnyBodyInjured3",
                        atFault: "whoWasAtFault3",
                        singleVehicleAccident: "wasItSingleVehicleAccident3",
                        incidentDate: "DateOfIncident3",
                        vehicleLocation: "whereWasTheVehicle3",
                        stolenItem: "whatWasStolen3",
                        vehicleRecovered: "wasTheVehicleRecovered3",
                        totalClaimCost: "TotalClaimCost3",
                    },
                },
            },

            convictions: {
                countField: "howManyConvictions",
                enableField: "HadConvictionAnswer",

                convictionDetails: {
                    conviction1: {
                        convictionDate: "convictionDate1",
                        dvlaCode: "DVLAConvictionCode1",
                        dvlaCodeOtherOption: "DVLAConvictionCodeOtherOption1",
                        pointsIncurred: "pointsIncurred1",
                        fineAmount: "fineIncurredAmount1",
                        banLengthMonths: "banLengthInMonths1",
                        breathalysed: "wasTheDriverBreathalysed1",
                        breathalyserReading: "whatWasTheBreathalyserReading1",
                        accidentRelated: "wasTheOffenceAccidentRelated1",
                    },
                    conviction2: {
                        convictionDate: "convictionDate2",
                        dvlaCode: "DVLAConvictionCode2",
                        dvlaCodeOtherOption: "DVLAConvictionCodeOtherOption2",
                        pointsIncurred: "pointsIncurred2",
                        fineAmount: "fineIncurredAmount2",
                        banLengthMonths: "banLengthInMonths2",
                        breathalysed: "wasTheDriverBreathalysed2",
                        breathalyserReading: "whatWasTheBreathalyserReading2",
                        accidentRelated: "wasTheOffenceAccidentRelated2",
                    },
                    conviction3: {
                        convictionDate: "convictionDate3",
                        dvlaCode: "DVLAConvictionCode3",
                        dvlaCodeOtherOption: "DVLAConvictionCodeOtherOption3",
                        pointsIncurred: "pointsIncurred3",
                        fineAmount: "fineIncurredAmount3",
                        banLengthMonths: "banLengthInMonths3",
                        breathalysed: "wasTheDriverBreathalysed3",
                        breathalyserReading: "whatWasTheBreathalyserReading3",
                        accidentRelated: "wasTheOffenceAccidentRelated3",
                    },
                },
            },
        },

        coverDetails: {
            coverStartDay: "CoverStartDay",
            coverStartFullDate: "CoverStartFullDate",
            coverType: "CoverType",
            voluntaryExcess: "VoluntaryExcess",
            breakDownOption: "breakDownOption",
            renewalReminder: "RR",
            protectedNoClaimsDiscount: "PNCD",
            guaranteedHireCar: "GuaranteedHireCar",
            motorLegalExpenses: "MotorLegalExpenses",
            product: "Product",
            declineMessage: "DeclineMessage",
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
            convertToMonthlyCard: "ConvertToMonthlyCard",
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
                    relationToPolicyHolderOther: "RelationToPHOthersOption",
                    isUKResident: "IsUKResident",
                    ukResidentYears: "UKResidentYears",
                    homeOwnership: "DoYouOwnYourHome",
                    ownsAnotherVehicle: "DoesDriverOwnAnotherVehicle",
                    phone: "Phone",
                    lvMemberAnswer: "LVMemberAnswer",
                    nonMotoringConvictionAnswer: "HadNonMotoringConvictionAnswer",
                },

                licenceDetails: {
                    enterDriverDetailsManually: "EnterDriverDetailsManually",
                    licenceType: "LicenceType",
                    licenceNumber: "LicenceNumber",
                    licencePart1: "LicencePart1",
                    licencePart2: "LicencePart2",
                    licenceHeldYears: "LicenceHeldYears",
                    licenceDate: "LicenceDate",
                    licenceTypeMoreOption: "LicenceTypeMoreOption",
                    licenceIssuedLocation: "LicenceIssuedLocation",
                    licenceForManualOrAutomatic: "LicenceForManualOrAutomatic",
                },

                drivingHistory: {
                    doTheyHaveAnyOtherVehicle: "DoTheyHaveAnyOtherVehicle",
                    medicalCondition: "MedicalCondition",
                    policyDeclinedCancelled: "PolicyDeclinedCancelled",
                },

                ncdDetails: {
                    ncdYears: "NCDYears",
                    howWasNCDEarned: "HowWasNCDEarned",
                    wantToProtectNCD: "DoYouWantToProctectNCD",
                },

                claims: {
                    countField: "howManyClaims",
                    enableField: "ClaimAnswer",
                    extraFields: ["HadClaimsAnswer"],

                    claimDetails: {
                        claim1: {
                            incidentType: "whatTypeOfIncidentWasIt1",
                            incidentOtherOption: "ClaimMoreOption1",
                            settled: "wasItSettled1",
                            anybodyInjured: "wasAnyBodyInjured1",
                            atFault: "whoWasAtFault1",
                            singleVehicleAccident: "wasItSingleVehicleAccident1",
                            incidentDate: "DateOfIncident1",
                            vehicleLocation: "whereWasTheVehicle1",
                            stolenItem: "whatWasStolen1",
                            vehicleRecovered: "wasTheVehicleRecovered1",
                            totalClaimCost: "TotalClaimCost1",
                        },
                        claim2: {
                            incidentType: "whatTypeOfIncidentWasIt2",
                            incidentOtherOption: "ClaimMoreOption2",
                            settled: "wasItSettled2",
                            anybodyInjured: "wasAnyBodyInjured2",
                            atFault: "whoWasAtFault2",
                            singleVehicleAccident: "wasItSingleVehicleAccident2",
                            incidentDate: "DateOfIncident2",
                            vehicleLocation: "whereWasTheVehicle2",
                            stolenItem: "whatWasStolen2",
                            vehicleRecovered: "wasTheVehicleRecovered2",
                            totalClaimCost: "TotalClaimCost2",
                        },
                        claim3: {
                            incidentType: "whatTypeOfIncidentWasIt3",
                            incidentOtherOption: "ClaimMoreOption3",
                            settled: "wasItSettled3",
                            anybodyInjured: "wasAnyBodyInjured3",
                            atFault: "whoWasAtFault3",
                            singleVehicleAccident: "wasItSingleVehicleAccident3",
                            incidentDate: "DateOfIncident3",
                            vehicleLocation: "whereWasTheVehicle3",
                            stolenItem: "whatWasStolen3",
                            vehicleRecovered: "wasTheVehicleRecovered3",
                            totalClaimCost: "TotalClaimCost3",
                        },
                    },
                },

                convictions: {
                    countField: "howManyConvictions",
                    enableField: "convictionAnswer",
                    extraFields: ["HadConvictionsAnswer"],

                    convictionDetails: {
                        conviction1: {
                            convictionDate: "convictionDate1",
                            dvlaCode: "DVLAConvictionCode1",
                            dvlaCodeOtherOption: "DVLAConvictionCodeOtherOption1",
                            pointsIncurred: "pointsIncurred1",
                            fineAmount: "fineIncurredAmount1",
                            banLengthMonths: "banLengthInMonths1",
                            breathalysed: "wasTheDriverBreathalysed1",
                            breathalyserReading: "whatWasTheBreathalyserReading1",
                            accidentRelated: "wasTheOffenceAccidentRelated1",
                        },
                        conviction2: {
                            convictionDate: "convictionDate2",
                            dvlaCode: "DVLAConvictionCode2",
                            dvlaCodeOtherOption: "DVLAConvictionCodeOtherOption2",
                            pointsIncurred: "pointsIncurred2",
                            fineAmount: "fineIncurredAmount2",
                            banLengthMonths: "banLengthInMonths2",
                            breathalysed: "wasTheDriverBreathalysed2",
                            breathalyserReading: "whatWasTheBreathalyserReading2",
                            accidentRelated: "wasTheOffenceAccidentRelated2",
                        },
                        conviction3: {
                            convictionDate: "DconvictionDate3",
                            dvlaCode: "DVLAConvictionCode3",
                            dvlaCodeOtherOption: "DVLAConvictionCodeOtherOption3",
                            pointsIncurred: "pointsIncurred3",
                            fineAmount: "fineIncurredAmount3",
                            banLengthMonths: "banLengthInMonths3",
                            breathalysed: "wasTheDriverBreathalysed3",
                            breathalyserReading: "whatWasTheBreathalyserReading3",
                            accidentRelated: "wasTheOffenceAccidentRelated3",
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
        "ScriptName",
        "Account Id",
    ],
};