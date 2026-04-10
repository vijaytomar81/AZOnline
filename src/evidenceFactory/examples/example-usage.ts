// src/evidenceFactory/examples/example-usage.ts
import { EvidenceFactory } from '../factory/evidence-factory';

async function main(): Promise<void> {
  const factory = new EvidenceFactory();

  await Promise.all([
    factory.writeEvidence({
      executionId: 'RUN-001',
      suiteName: 'motor-regression',
      artifactId: 'TC001',
      artifactName: 'create-quote',
      status: 'passed',
      consoleMode: 'e2e',
      outputFormats: ['json', 'xml', 'csv', 'console'],
      payload: {
        scenarioId: 'SCN-001',
        scenarioName: 'Create Quote',
        platform: 'Athena',
        application: 'AzOnline',
        product: 'Motor',
        journeyStartWith: 'NewBusiness',
        description: 'Create quote and verify premium',
        status: 'passed',
        itemNo: 1,
        action: 'Create Quote',
        subType: 'HappyPath',
        portal: 'AzOnline',
        testCaseRef: 'TC001',
        startedAt: new Date().toISOString(),
        finishedAt: new Date().toISOString(),
        message: '',
        errorDetails: '',
        blockedBy: '',
        calculatedEmail: 'test@example.com',
        calculatedEmailId: 'test',
        quoteNumber: 'Q-10001',
        policyNumber: 'P-10001',
        runtimeInfo: {
          system: { platform: process.platform, node: process.version },
          browser: { name: 'chromium', headless: true },
        },
      },
    }),
    factory.writeEvidence({
      executionId: 'RUN-001',
      suiteName: 'motor-regression',
      artifactId: 'TC002',
      artifactName: 'payment-failure',
      status: 'failed',
      consoleMode: 'e2e',
      outputFormats: ['json', 'xml', 'csv', 'console'],
      payload: {
        scenarioId: 'SCN-002',
        scenarioName: 'Payment Failure',
        platform: 'Athena',
        application: 'AzOnline',
        product: 'Motor',
        journeyStartWith: 'NewBusiness',
        description: 'Payment rejected',
        status: 'failed',
        itemNo: 2,
        action: 'Take Payment',
        subType: 'NegativePath',
        portal: 'AzOnline',
        testCaseRef: 'TC002',
        startedAt: new Date().toISOString(),
        finishedAt: new Date().toISOString(),
        message: 'Card rejected',
        errorDetails: 'Gateway returned 402',
        blockedBy: '',
        calculatedEmail: 'test2@example.com',
        quoteNumber: 'Q-10002',
        policyNumber: '',
      },
    }),
  ]);

  const result = await factory.finalizeExecution({
    executionId: 'RUN-001',
    suiteName: 'motor-regression',
    metaPayload: {
      runId: 'RUN-001',
      mode: 'e2e',
      environment: 'qa',
      startedAt: new Date().toISOString(),
      finishedAt: new Date().toISOString(),
      totalTime: '6000',
      totalItems: 2,
      passedItems: 1,
      failedItems: 1,
      errorItems: 0,
      notExecutedItems: 0,
      totalCount: 2,
      passedCount: 1,
      failedCount: 1,
      errorCount: 0,
      notExecutedCount: 0,
      workerArtifactCount: 2,
      mergedCaseCount: 0,
      corruptedArtifactCount: 0,
      duplicateCaseCount: 0,
      cleanupWorkerArtifacts: false,
      finalizedAt: new Date().toISOString(),
      artifactTimestamp: new Date().toISOString(),
      outputRoot: 'artifacts',
      evidenceDir: 'artifacts/current/motor-regression/RUN-001',
      passedEvidencePath: 'artifacts/current/motor-regression/RUN-001/json/passed',
      failedEvidencePath: 'artifacts/current/motor-regression/RUN-001/json/failed',
      notExecutedEvidencePath: 'artifacts/current/motor-regression/RUN-001/json/not-executed',
      pageScansDir: '',
      promotedPageScanCount: 0,
      runtimeInfo: {
        system: { platform: process.platform, node: process.version },
        browser: { name: 'chromium', headless: true },
      },
    },
  });

  console.log('Finalized execution:', result);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
