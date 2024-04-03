import { envConfig, isTest } from '@/env';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { type KyselySchema } from './schema';

const DEFAULT_DB_URL = isTest() ? envConfig.TEST_DB_URL : envConfig.DB_URL;

export function createDbClient(dbUrl: string = DEFAULT_DB_URL) {
  const dbClient = new Kysely<KyselySchema>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: dbUrl,
        max: 20, // Set maximum <number> of client(s) in the pool
        connectionTimeoutMillis: 1000, // return an error after <number> second(s) if connection could not be established
        idleTimeoutMillis: 1000, // close idle clients after <number> second(s)
      }),
    }),
  });

  return dbClient;
}

export type DbClient = ReturnType<typeof createDbClient>;
