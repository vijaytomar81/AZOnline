// src/frameworkCore/executionLayer/core/runner/runScenarioBatch.ts

export async function runScenarioBatch<T, R>(
    items: T[],
    batchSize: number,
    worker: (item: T) => Promise<R>
): Promise<R[]> {
    const results: R[] = [];

    for (let index = 0; index < items.length; index += batchSize) {
        const batch = items.slice(index, index + batchSize);
        const batchResults = await Promise.all(batch.map(worker));
        results.push(...batchResults);
    }

    return results;
}
