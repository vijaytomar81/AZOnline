// src/evidenceFactory/examples/example-usage.ts

import { EvidenceFactory } from '../factory/evidence-factory';
import { EXECUTION_MODES } from '@configLayer/core/executionModes';

async function main(): Promise<void> {
  const factory = new EvidenceFactory();

  const startedAt = new Date();
  const secondStartedAt = new Date(startedAt.getTime() + 2_000);
  const finishedAt = new Date(startedAt.getTime() + 7_740);

  await Promise.all([
    factory.writeEvidence({
      entryType: 'item',
      executionId: 'RUN-001',
      suiteName: 'motor-regression',
      workerId: '0',
      artifactId: 'TC001',
      artifactName: 'create-quote',
      status: 'passed',
      consoleMode: EXECUTION_MODES.E2E,
      outputFormats: ['json', 'excel'],
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
        startedAt: startedAt.toISOString(),
        finishedAt: new Date(startedAt.getTime() + 2_500).toISOString(),
        message: '',
        errorDetails: '',
        blockedBy: '',
        calculatedEmail: 'test@example.com',
        calculatedEmailId: 'test',
        quoteNumber: 'Q-10001',
        policyNumber: 'P-10001',
      },
    }),
    factory.writeEvidence({
      entryType: 'item',
      executionId: 'RUN-001',
      suiteName: 'motor-regression',
      workerId: '1',
      artifactId: 'TC002',
      artifactName: 'payment-failure',
      status: 'failed',
      consoleMode: EXECUTION_MODES.E2E,
      outputFormats: ['xml', 'csv', 'excel'],
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
        startedAt: secondStartedAt.toISOString(),
        finishedAt: finishedAt.toISOString(),
        message: 'Card rejected',
        errorDetails: 'Gateway returned 402',
        blockedBy: '',
        calculatedEmail: 'test2@example.com',
        calculatedEmailId: 'test2',
        quoteNumber: 'Q-10002',
        policyNumber: '',
      },
    }),
  ]);

  await factory.writeEvidence({
    entryType: 'summary',
    executionId: 'RUN-001',
    suiteName: 'motor-regression',
    outputFormats: ['excel', 'console'],
    metaPayload: {
      runId: 'RUN-001',
      mode: EXECUTION_MODES.E2E,
      environment: 'qa',
      evidenceDirectory: 'artifacts/motor-regression/RUN-001',
      machineName: 'Vijays-MacBook-Air.local',
      user: 'vijaytomar',
      platform: 'darwin',
      osVersion: '25.3.0',
      browser: 'chromium',
      browserChannel: 'msedge',
      browserVersion: '146.0.3856.97',
      headless: true,
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
      passRate: '50.00%',
      executionTime: '7.74s',
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      totalTime: '7740',
      workerArtifactCount: 2,
      mergedCaseCount: 0,
      corruptedArtifactCount: 0,
      duplicateCaseCount: 0,
      cleanupWorkerArtifacts: false,
      finalizedAt: finishedAt.toISOString(),
      artifactTimestamp: finishedAt.toISOString(),
      promotedPageScanCount: 0,
      outputRoot: 'artifacts',
      evidenceDir: 'artifacts/motor-regression/RUN-001',
      passedEvidencePath: '',
      failedEvidencePath: '',
      notExecutedEvidencePath: '',
      pageScansDir: '',
    },
  });

  const result = await factory.finalizeExecution({
    executionId: 'RUN-001',
    suiteName: 'motor-regression',
  });

  console.log('Finalized execution:', result);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
