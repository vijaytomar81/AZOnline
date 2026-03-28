// src/execution/core/case/runCaseBatch.ts

export async function runCaseBatch<T, R>(
    items: T[],
    batchSize: number,
    worker: (item: T) => Promise<R>
): Promise<R[]> {
    const results: R[] = [];

    for (let i = 0; i < items.length; i += batchSize) {
        const batch = items.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch.map(worker));
        results.push(...batchResults);
    }

    return results;
}
