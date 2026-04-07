// src/pageActions/actions/athena/motor/fillPhDrivingLicenceDetails.action.ts

import type { PageAction } from "@businessLayer/pageActions/shared";
import {
    requireRecordValue,
    requireStringValue,
    logPageActionInfo,
} from "@businessLayer/pageActions/shared";

export const fillPhDrivingLicenceDetailsAction: PageAction = async ({
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
        message: "fillPhDrivingLicenceDetailsAction started.",
    });

    const dateOfBirthDay = requireStringValue({
        value: data.dateOfBirthDay,
        fieldName: "dateOfBirthDay",
        source: "PhDrivingLicenceDetailsPage",
    });
    await context.pages.athena.phDrivingLicenceDetails.inputDateOfBirthDay(dateOfBirthDay);

    const dateOfBirthMonth = requireStringValue({
        value: data.dateOfBirthMonth,
        fieldName: "dateOfBirthMonth",
        source: "PhDrivingLicenceDetailsPage",
    });
    await context.pages.athena.phDrivingLicenceDetails.inputDateOfBirthMonth(dateOfBirthMonth);

    const dateOfBirthYear = requireStringValue({
        value: data.dateOfBirthYear,
        fieldName: "dateOfBirthYear",
        source: "PhDrivingLicenceDetailsPage",
    });
    await context.pages.athena.phDrivingLicenceDetails.inputDateOfBirthYear(dateOfBirthYear);

    const firstName = requireStringValue({
        value: data.firstName,
        fieldName: "firstName",
        source: "PhDrivingLicenceDetailsPage",
    });
    await context.pages.athena.phDrivingLicenceDetails.inputFirstName(firstName);

    const lastName = requireStringValue({
        value: data.lastName,
        fieldName: "lastName",
        source: "PhDrivingLicenceDetailsPage",
    });
    await context.pages.athena.phDrivingLicenceDetails.inputLastName(lastName);

    const drivingExpirience = requireStringValue({
        value: data.drivingExpirience,
        fieldName: "drivingExpirience",
        source: "PhDrivingLicenceDetailsPage",
    });
    await context.pages.athena.phDrivingLicenceDetails.selectDrivingExpirience(drivingExpirience);

    const titleQuestion = requireStringValue({
        value: data.titleQuestion,
        fieldName: "titleQuestion",
        source: "PhDrivingLicenceDetailsPage",
    });
    await context.pages.athena.phDrivingLicenceDetails.selectTitleQuestion(titleQuestion);

    const convictionCount = Math.min(Number(data.convictionCount ?? 0), 5);

    if (convictionCount >= 1) {
        const conviction1DateMonth = requireStringValue({
            value: data.conviction1DateMonth,
            fieldName: "conviction1DateMonth",
            source: "PhDrivingLicenceDetailsPage",
        });
        await context.pages.athena.phDrivingLicenceDetails.inputConviction1DateMonth(conviction1DateMonth);

        const conviction1DateYear = requireStringValue({
            value: data.conviction1DateYear,
            fieldName: "conviction1DateYear",
            source: "PhDrivingLicenceDetailsPage",
        });
        await context.pages.athena.phDrivingLicenceDetails.inputConviction1DateYear(conviction1DateYear);

        const selectTheConvictionCode = requireStringValue({
            value: data.selectTheConvictionCode,
            fieldName: "selectTheConvictionCode",
            source: "PhDrivingLicenceDetailsPage",
        });
        await context.pages.athena.phDrivingLicenceDetails.searchSelectTheConvictionCode(selectTheConvictionCode);
    }

    if (convictionCount >= 2) {
        await context.pages.athena.phDrivingLicenceDetails.buttonAddAnotherConviction();

        const conviction2DateMonth = requireStringValue({
            value: data.conviction2DateMonth,
            fieldName: "conviction2DateMonth",
            source: "PhDrivingLicenceDetailsPage",
        });
        await context.pages.athena.phDrivingLicenceDetails.inputConviction2DateMonth(conviction2DateMonth);

        const conviction2DateYear = requireStringValue({
            value: data.conviction2DateYear,
            fieldName: "conviction2DateYear",
            source: "PhDrivingLicenceDetailsPage",
        });
        await context.pages.athena.phDrivingLicenceDetails.inputConviction2DateYear(conviction2DateYear);

        const selectTheConvictionCode2 = requireStringValue({
            value: data.selectTheConvictionCode2,
            fieldName: "selectTheConvictionCode2",
            source: "PhDrivingLicenceDetailsPage",
        });
        await context.pages.athena.phDrivingLicenceDetails.searchSelectTheConvictionCode2(selectTheConvictionCode2);
    }

    if (convictionCount >= 3) {
        await context.pages.athena.phDrivingLicenceDetails.buttonAddAnotherConviction();

        const conviction3DateMonth = requireStringValue({
            value: data.conviction3DateMonth,
            fieldName: "conviction3DateMonth",
            source: "PhDrivingLicenceDetailsPage",
        });
        await context.pages.athena.phDrivingLicenceDetails.inputConviction3DateMonth(conviction3DateMonth);

        const conviction3DateYear = requireStringValue({
            value: data.conviction3DateYear,
            fieldName: "conviction3DateYear",
            source: "PhDrivingLicenceDetailsPage",
        });
        await context.pages.athena.phDrivingLicenceDetails.inputConviction3DateYear(conviction3DateYear);

        const selectTheConvictionCode3 = requireStringValue({
            value: data.selectTheConvictionCode3,
            fieldName: "selectTheConvictionCode3",
            source: "PhDrivingLicenceDetailsPage",
        });
        await context.pages.athena.phDrivingLicenceDetails.searchSelectTheConvictionCode3(selectTheConvictionCode3);
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
         await context.pages.athena.phDrivingLicenceDetails.inputAddressLookupWidgetAddressLookupQuestionInputBuilding(addressLookupWidgetAddressLookupQuestionInputBuilding);

         const addressLookupWidgetAddressLookupQuestionInputPostcode = requireStringValue({
             value: data.addressLookupWidgetAddressLookupQuestionInputPostcode,
             fieldName: "addressLookupWidgetAddressLookupQuestionInputPostcode",
             source: "PhDrivingLicenceDetailsPage",
         });
         await context.pages.athena.phDrivingLicenceDetails.inputAddressLookupWidgetAddressLookupQuestionInputPostcode(addressLookupWidgetAddressLookupQuestionInputPostcode);

         const addressLookupQuestionInput = requireStringValue({
             value: data.addressLookupQuestionInput,
             fieldName: "addressLookupQuestionInput",
             source: "PhDrivingLicenceDetailsPage",
         });
         await context.pages.athena.phDrivingLicenceDetails.selectAddressLookupQuestionInput(addressLookupQuestionInput);

    */

    /*
     --------------------------------------------------------------------------- 
     TODO: review and enable click / radio / link interactions if needed:
     --------------------------------------------------------------------------- 
    
         await context.pages.athena.phDrivingLicenceDetails.buttonFindAddress();

         await context.pages.athena.phDrivingLicenceDetails.buttonNavigatorBack();

         await context.pages.athena.phDrivingLicenceDetails.buttonNavigatorNext();

         await context.pages.athena.phDrivingLicenceDetails.groupRadioConviction0ResultedToABan();

         await context.pages.athena.phDrivingLicenceDetails.groupRadioConviction1ResultedToABan();

         await context.pages.athena.phDrivingLicenceDetails.groupRadioConviction2ResultedToABan();

         await context.pages.athena.phDrivingLicenceDetails.groupRadioDrivingLicenceHandy();

         await context.pages.athena.phDrivingLicenceDetails.groupRadioDrivingLicenceTypes();

         await context.pages.athena.phDrivingLicenceDetails.groupRadioHasConvictionsQuestion();

         await context.pages.athena.phDrivingLicenceDetails.linkRemoveConviction();

         await context.pages.athena.phDrivingLicenceDetails.linkRemoveConviction2();

         await context.pages.athena.phDrivingLicenceDetails.linkRemoveConviction3();

         await context.pages.athena.phDrivingLicenceDetails.linkToAllianzHomePage();

         await context.pages.athena.phDrivingLicenceDetails.radioConviction0ResultedToABanno();

         await context.pages.athena.phDrivingLicenceDetails.radioConviction0ResultedToABanyes();

         await context.pages.athena.phDrivingLicenceDetails.radioConviction1ResultedToABanno();

         await context.pages.athena.phDrivingLicenceDetails.radioConviction1ResultedToABanyes();

         await context.pages.athena.phDrivingLicenceDetails.radioConviction2ResultedToABanno();

         await context.pages.athena.phDrivingLicenceDetails.radioConviction2ResultedToABanyes();

         await context.pages.athena.phDrivingLicenceDetails.radioDrivingLicenceHandyno();

         await context.pages.athena.phDrivingLicenceDetails.radioDrivingLicenceHandyyes();

         await context.pages.athena.phDrivingLicenceDetails.radioDrivingLicenceTypeseuFull();

         await context.pages.athena.phDrivingLicenceDetails.radioDrivingLicenceTypeseuProvisional();

         await context.pages.athena.phDrivingLicenceDetails.radioDrivingLicenceTypesother();

         await context.pages.athena.phDrivingLicenceDetails.radioDrivingLicenceTypesukFull();

         await context.pages.athena.phDrivingLicenceDetails.radioDrivingLicenceTypesukFullAutomaticOnly();

         await context.pages.athena.phDrivingLicenceDetails.radioDrivingLicenceTypesukProvisional();

         await context.pages.athena.phDrivingLicenceDetails.radioHasConvictionsQuestionno();

         await context.pages.athena.phDrivingLicenceDetails.radioHasConvictionsQuestionyes();

    */

    logPageActionInfo({
        scope: context.logScope,
        message: "fillPhDrivingLicenceDetailsAction completed.",
    });
};
