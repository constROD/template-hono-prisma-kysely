import { getEnvConfig, isTest } from '@/env';
import { ForbiddenError } from '@/utils/errors';
import { Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';

import type { KyselySchema } from './schema';

export function createDbClient() {
  if (isTest())
    throw new ForbiddenError(
      'createDbClient cannot be used in test environment use createTestDbClient instead.'
    );

  const envConfig = getEnvConfig();

  const dbClient = new Kysely<KyselySchema>({
    dialect: new PostgresDialect({ pool: new pg.Pool({ connectionString: envConfig.DB_URL }) }),
  });

  return dbClient;
}

/**
 * This is a helper function to create a database client for testing purposes only.
 */
export function createTestDbClient() {
  const envConfig = getEnvConfig();

  const dbClient = new Kysely<KyselySchema>({
    dialect: new PostgresDialect({
      pool: new pg.Pool({ connectionString: envConfig.TEST_DB_URL }),
    }),
  });

  return dbClient;
}

export type DbClient = ReturnType<typeof createDbClient> | ReturnType<typeof createTestDbClient>;
