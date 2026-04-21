// src/businessLayer/pageActions/actions/athena/azonline/motor/phDrivingLicenceDetails.action.ts

import type { PageAction } from "@businessLayer/pageActions/shared";
import {
    requireRecordValue,
    requireStringValue,
    logPageActionInfo,
} from "@businessLayer/pageActions/shared";

export const phDrivingLicenceDetailsAction: PageAction = async ({
    context,
    payload,
}) => {
    const data = requireRecordValue({
        value: payload,
        fieldName: "payload",
        source: "PhDrivingLicenceDetailsPage",
    });

    logPageActionInfo({
        scope: context.logScope,
        message: "phDrivingLicenceDetailsAction started.",
    });

    const dateOfBirthDay = requireStringValue({
        value: data.dateOfBirthDay,
        fieldName: "dateOfBirthDay",
        source: "PhDrivingLicenceDetailsPage",
    });
    await context.pages.motor.phDrivingLicenceDetails.inputDateOfBirthDay(dateOfBirthDay);

    const dateOfBirthMonth = requireStringValue({
        value: data.dateOfBirthMonth,
        fieldName: "dateOfBirthMonth",
        source: "PhDrivingLicenceDetailsPage",
    });
    await context.pages.motor.phDrivingLicenceDetails.inputDateOfBirthMonth(dateOfBirthMonth);

    const dateOfBirthYear = requireStringValue({
        value: data.dateOfBirthYear,
        fieldName: "dateOfBirthYear",
        source: "PhDrivingLicenceDetailsPage",
    });
    await context.pages.motor.phDrivingLicenceDetails.inputDateOfBirthYear(dateOfBirthYear);

    const firstName = requireStringValue({
        value: data.firstName,
        fieldName: "firstName",
        source: "PhDrivingLicenceDetailsPage",
    });
    await context.pages.motor.phDrivingLicenceDetails.inputFirstName(firstName);

    const lastName = requireStringValue({
        value: data.lastName,
        fieldName: "lastName",
        source: "PhDrivingLicenceDetailsPage",
    });
    await context.pages.motor.phDrivingLicenceDetails.inputLastName(lastName);

    const drivingExpirience = requireStringValue({
        value: data.drivingExpirience,
        fieldName: "drivingExpirience",
        source: "PhDrivingLicenceDetailsPage",
    });
    await context.pages.motor.phDrivingLicenceDetails.selectDrivingExpirience(drivingExpirience);

    const titleQuestion = requireStringValue({
        value: data.titleQuestion,
        fieldName: "titleQuestion",
        source: "PhDrivingLicenceDetailsPage",
    });
    await context.pages.motor.phDrivingLicenceDetails.selectTitleQuestion(titleQuestion);

    const convictionCount = Math.min(Number(data.convictionCount ?? 0), 5);

    if (convictionCount >= 1) {
        const conviction1DateMonth = requireStringValue({
            value: data.conviction1DateMonth,
            fieldName: "conviction1DateMonth",
            source: "PhDrivingLicenceDetailsPage",
        });
        await context.pages.motor.phDrivingLicenceDetails.inputConviction1DateMonth(conviction1DateMonth);

        const conviction1DateYear = requireStringValue({
            value: data.conviction1DateYear,
            fieldName: "conviction1DateYear",
            source: "PhDrivingLicenceDetailsPage",
        });
        await context.pages.motor.phDrivingLicenceDetails.inputConviction1DateYear(conviction1DateYear);

        const conviction2DateMonth = requireStringValue({
            value: data.conviction2DateMonth,
            fieldName: "conviction2DateMonth",
            source: "PhDrivingLicenceDetailsPage",
        });
        await context.pages.motor.phDrivingLicenceDetails.inputConviction2DateMonth(conviction2DateMonth);

        const conviction2DateYear = requireStringValue({
            value: data.conviction2DateYear,
            fieldName: "conviction2DateYear",
            source: "PhDrivingLicenceDetailsPage",
        });
        await context.pages.motor.phDrivingLicenceDetails.inputConviction2DateYear(conviction2DateYear);

        const conviction3DateMonth = requireStringValue({
            value: data.conviction3DateMonth,
            fieldName: "conviction3DateMonth",
            source: "PhDrivingLicenceDetailsPage",
        });
        await context.pages.motor.phDrivingLicenceDetails.inputConviction3DateMonth(conviction3DateMonth);

        const conviction3DateYear = requireStringValue({
            value: data.conviction3DateYear,
            fieldName: "conviction3DateYear",
            source: "PhDrivingLicenceDetailsPage",
        });
        await context.pages.motor.phDrivingLicenceDetails.inputConviction3DateYear(conviction3DateYear);

        const selectTheConvictionCode = requireStringValue({
            value: data.selectTheConvictionCode,
            fieldName: "selectTheConvictionCode",
            source: "PhDrivingLicenceDetailsPage",
        });
        await context.pages.motor.phDrivingLicenceDetails.searchSelectTheConvictionCode(selectTheConvictionCode);

        const selectTheConvictionCode2 = requireStringValue({
            value: data.selectTheConvictionCode2,
            fieldName: "selectTheConvictionCode2",
            source: "PhDrivingLicenceDetailsPage",
        });
        await context.pages.motor.phDrivingLicenceDetails.searchSelectTheConvictionCode2(selectTheConvictionCode2);

        const selectTheConvictionCode3 = requireStringValue({
            value: data.selectTheConvictionCode3,
            fieldName: "selectTheConvictionCode3",
            source: "PhDrivingLicenceDetailsPage",
        });
        await context.pages.motor.phDrivingLicenceDetails.searchSelectTheConvictionCode3(selectTheConvictionCode3);
    }

    /*
     --------------------------------------------------------------------------- 
     TODO: review and enable conditional / low-confidence mappings if needed:
     --------------------------------------------------------------------------- 
    
         const addressLookupWidgetAddressLookupQuestionInputBuilding = requireStringValue({
             value: data.addressLookupWidgetAddressLookupQuestionInputBuilding,
             fieldName: "addressLookupWidgetAddressLookupQuestionInputBuilding",
             source: "PhDrivingLicenceDetailsPage",
         });
         await context.pages.motor.phDrivingLicenceDetails.inputAddressLookupWidgetAddressLookupQuestionInputBuilding(addressLookupWidgetAddressLookupQuestionInputBuilding);

         const addressLookupWidgetAddressLookupQuestionInputPostcode = requireStringValue({
             value: data.addressLookupWidgetAddressLookupQuestionInputPostcode,
             fieldName: "addressLookupWidgetAddressLookupQuestionInputPostcode",
             source: "PhDrivingLicenceDetailsPage",
         });
         await context.pages.motor.phDrivingLicenceDetails.inputAddressLookupWidgetAddressLookupQuestionInputPostcode(addressLookupWidgetAddressLookupQuestionInputPostcode);

         const addressLookupQuestionInput = requireStringValue({
             value: data.addressLookupQuestionInput,
             fieldName: "addressLookupQuestionInput",
             source: "PhDrivingLicenceDetailsPage",
         });
         await context.pages.motor.phDrivingLicenceDetails.selectAddressLookupQuestionInput(addressLookupQuestionInput);

    */

    /*
     --------------------------------------------------------------------------- 
     TODO: review and enable click / radio / link interactions if needed:
     --------------------------------------------------------------------------- 
    
     await context.pages.motor.phDrivingLicenceDetails.buttonFindAddress();
     await context.pages.motor.phDrivingLicenceDetails.buttonNavigatorBack();
     await context.pages.motor.phDrivingLicenceDetails.buttonNavigatorNext();
     await context.pages.motor.phDrivingLicenceDetails.groupRadioConviction0ResultedToABan();
     await context.pages.motor.phDrivingLicenceDetails.groupRadioConviction1ResultedToABan();
     await context.pages.motor.phDrivingLicenceDetails.groupRadioConviction2ResultedToABan();
     await context.pages.motor.phDrivingLicenceDetails.groupRadioDrivingLicenceHandy();
     await context.pages.motor.phDrivingLicenceDetails.groupRadioDrivingLicenceTypes();
     await context.pages.motor.phDrivingLicenceDetails.groupRadioHasConvictionsQuestion();
     await context.pages.motor.phDrivingLicenceDetails.linkRemoveConviction();
     await context.pages.motor.phDrivingLicenceDetails.linkRemoveConviction2();
     await context.pages.motor.phDrivingLicenceDetails.linkRemoveConviction3();
     await context.pages.motor.phDrivingLicenceDetails.linkToAllianzHomePage();
     await context.pages.motor.phDrivingLicenceDetails.radioConviction0ResultedToABanno();
     await context.pages.motor.phDrivingLicenceDetails.radioConviction0ResultedToABanyes();
     await context.pages.motor.phDrivingLicenceDetails.radioConviction1ResultedToABanno();
     await context.pages.motor.phDrivingLicenceDetails.radioConviction1ResultedToABanyes();
     await context.pages.motor.phDrivingLicenceDetails.radioConviction2ResultedToABanno();
     await context.pages.motor.phDrivingLicenceDetails.radioConviction2ResultedToABanyes();
     await context.pages.motor.phDrivingLicenceDetails.radioDrivingLicenceHandyno();
     await context.pages.motor.phDrivingLicenceDetails.radioDrivingLicenceHandyyes();
     await context.pages.motor.phDrivingLicenceDetails.radioDrivingLicenceTypeseuFull();
     await context.pages.motor.phDrivingLicenceDetails.radioDrivingLicenceTypeseuProvisional();
     await context.pages.motor.phDrivingLicenceDetails.radioDrivingLicenceTypesother();
     await context.pages.motor.phDrivingLicenceDetails.radioDrivingLicenceTypesukFull();
     await context.pages.motor.phDrivingLicenceDetails.radioDrivingLicenceTypesukFullAutomaticOnly();
     await context.pages.motor.phDrivingLicenceDetails.radioDrivingLicenceTypesukProvisional();
     await context.pages.motor.phDrivingLicenceDetails.radioHasConvictionsQuestionno();
     await context.pages.motor.phDrivingLicenceDetails.radioHasConvictionsQuestionyes();
    */

    logPageActionInfo({
        scope: context.logScope,
        message: "phDrivingLicenceDetailsAction completed.",
    });
};
