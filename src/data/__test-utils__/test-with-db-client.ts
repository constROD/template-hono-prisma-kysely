import { createTestDbClient, type DbClient } from '@/db/create-db-client';
import { type KyselySchema } from '@/db/schema';
import type { Transaction } from 'kysely';
import { test } from 'vitest';

export class KyselyRollbackError extends Error {}

export const testWithDbClient = test.extend<{ dbClient: DbClient }>({
  // eslint-disable-next-line no-empty-pattern
  dbClient: async ({}, use) => {
    let dbClient: DbClient | undefined;
    try {
      dbClient = createTestDbClient();
      await dbClient
        .transaction()
        .setIsolationLevel('read uncommitted')
        .execute(async (trx: Transaction<KyselySchema>) => {
          await use(trx);
          throw new KyselyRollbackError();
        });
    } catch (err) {
      const isRollbackError = err instanceof KyselyRollbackError;
      if (!isRollbackError) throw err;
    } finally {
      await dbClient?.destroy();
    }
  },
});
