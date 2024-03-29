import { envConfig, isTest } from '@/env';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { type KyselyTables } from './schema';

const DEFAULT_DB_URL = isTest() ? envConfig.TEST_DB_URL : envConfig.DB_URL;

export function createDbClient(dbUrl: string = DEFAULT_DB_URL) {
  const dbClient = new Kysely<KyselyTables>({
    dialect: new PostgresDialect({
      pool: new Pool({ connectionString: dbUrl }),
    }),
  });

  return dbClient;
}

export type DbClient = ReturnType<typeof createDbClient>;
