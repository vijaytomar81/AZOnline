// src/evidenceFactory/examples/schemas.ts
import { defineSchema } from '../contracts/schema';

export type CarInsurancePayload = {
  policyId: string;
  applicantName: string;
  premium: number;
  approved: boolean;
  quoteDate: string;
  registrationNumber: string;
};

export type HomeInsurancePayload = {
  policyId: string;
  applicantName: string;
  premium: number;
  approved: boolean;
  quoteDate: string;
  propertyPostcode: string;
};

export const carInsuranceSchema = defineSchema<CarInsurancePayload>({
  name: 'car-insurance',
  fields: {
    policyId: { type: 'string', required: true },
    applicantName: { type: 'string', required: true },
    premium: { type: 'number', required: true },
    approved: { type: 'boolean', required: true },
    quoteDate: { type: 'date', required: true },
    registrationNumber: { type: 'string', required: true, masked: true },
  },
});

export const homeInsuranceSchema = defineSchema<HomeInsurancePayload>({
  name: 'home-insurance',
  fields: {
    policyId: { type: 'string', required: true },
    applicantName: { type: 'string', required: true },
    premium: { type: 'number', required: true },
    approved: { type: 'boolean', required: true },
    quoteDate: { type: 'date', required: true },
    propertyPostcode: { type: 'string', required: true, masked: true },
  },
});
