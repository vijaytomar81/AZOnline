// src/evidenceFactory/examples/car-run-example.ts
import { EvidenceFactory } from '../factory/evidence-factory';
import { carInsuranceSchema } from './schemas';

async function main(): Promise<void> {
  const factory = new EvidenceFactory();
  await Promise.all([
    factory.writeEvidence(carInsuranceSchema, {
      executionId: 'EXEC-CAR-001',
      suiteName: 'car-regression',
      appName: 'insurance-e2e',
      insuranceType: 'car',
      testCaseId: 'TC001',
      testName: 'create-policy',
      status: 'PASSED',
      startedAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
      durationMs: 900,
      environment: 'qa',
      data: {
        policyId: 'CAR-1001', applicantName: 'John Smith', premium: 450.55,
        approved: true, quoteDate: new Date().toISOString(), registrationNumber: 'AB12CDE',
      },
      outputFormats: ['json', 'xml', 'csv', 'console'],
    }),
    factory.writeEvidence(carInsuranceSchema, {
      executionId: 'EXEC-CAR-001',
      suiteName: 'car-regression',
      appName: 'insurance-e2e',
      insuranceType: 'car',
      testCaseId: 'TC002',
      testName: 'reject-high-risk',
      status: 'FAILED',
      startedAt: new Date().toISOString(),
      endedAt: new Date().toISOString(),
      durationMs: 1200,
      environment: 'qa',
      failureReason: 'Premium mismatch',
      data: {
        policyId: 'CAR-1002', applicantName: 'Jane Doe', premium: 999.99,
        approved: false, quoteDate: new Date().toISOString(), registrationNumber: 'XY98ZZZ',
      },
      outputFormats: ['json', 'xml', 'csv', 'console'],
    }),
  ]);
  const result = await factory.finalizeExecution({
    executionId: 'EXEC-CAR-001', suiteName: 'car-regression', appName: 'insurance-e2e', environment: 'qa',
  });
  console.log('Finalized:', result);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
