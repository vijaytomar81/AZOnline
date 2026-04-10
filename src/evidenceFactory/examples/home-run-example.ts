// src/evidenceFactory/examples/home-run-example.ts
import { EvidenceFactory } from '../factory/evidence-factory';
import { homeInsuranceSchema } from './schemas';

async function main(): Promise<void> {
  const factory = new EvidenceFactory();
  await factory.writeEvidence(homeInsuranceSchema, {
    executionId: 'EXEC-HOME-001',
    suiteName: 'home-regression',
    appName: 'insurance-e2e',
    insuranceType: 'home',
    testCaseId: 'TC101',
    testName: 'quote-home-policy',
    status: 'ERROR',
    startedAt: new Date().toISOString(),
    endedAt: new Date().toISOString(),
    durationMs: 1500,
    environment: 'qa',
    errorMessage: 'Upstream address service timeout',
    data: {
      policyId: 'HOME-2001', applicantName: 'Alice Lee', premium: 215.35,
      approved: false, quoteDate: new Date().toISOString(), propertyPostcode: 'SW1A1AA',
    },
    outputFormats: ['json', 'xml', 'csv', 'console'],
  });
  const result = await factory.finalizeExecution({
    executionId: 'EXEC-HOME-001', suiteName: 'home-regression', appName: 'insurance-e2e', environment: 'qa',
  });
  console.log('Finalized:', result);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
