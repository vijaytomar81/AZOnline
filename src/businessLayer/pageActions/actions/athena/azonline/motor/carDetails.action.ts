// src/businessLayer/pageActions/actions/athena/azonline/motor/carDetails.action.ts

import type { PageAction } from "@businessLayer/pageActions/shared";
import {
    requireRecordValue,
    requireStringValue,
    logPageActionInfo,
} from "@businessLayer/pageActions/shared";

export const carDetailsAction: PageAction = async ({
    context,
    payload,
}) => {
    const data = requireRecordValue({
        value: payload,
        fieldName: "payload",
        source: "CarDetailsPage",
    });

    logPageActionInfo({
        scope: context.logScope,
        message: "carDetailsAction started.",
    });

    const registrationNumber = requireStringValue({
        value: data.registrationNumber,
        fieldName: "registrationNumber",
        source: "CarDetailsPage",
    });
    await context.pages.motor.carDetails.inputRegistrationNumber(registrationNumber);

    /*
     --------------------------------------------------------------------------- 
     TODO: review and enable click / radio / link interactions if needed:
     --------------------------------------------------------------------------- 
    
     await context.pages.motor.carDetails.buttonFindMyCar();
     await context.pages.motor.carDetails.groupRadioRegistrationNumberPolarQuestion();
     await context.pages.motor.carDetails.linkPersonalInfoUse();
     await context.pages.motor.carDetails.linkToAllianzHomePage();
     await context.pages.motor.carDetails.radioRegistrationNumberPolarQuestionNo();
     await context.pages.motor.carDetails.radioRegistrationNumberPolarQuestionYes();
    */

    logPageActionInfo({
        scope: context.logScope,
        message: "carDetailsAction completed.",
    });
};
