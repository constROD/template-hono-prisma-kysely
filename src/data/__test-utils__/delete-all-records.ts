import { STAGES } from '@/constants/env';
import { type DbClient } from '@/db/create-db-client';
import { type KyselySchema } from '@/db/schema';
import { envConfig, isTest } from '@/env';
import { ForbiddenError } from '@/utils/errors';
import { sql } from 'kysely';

export async function deleteAllRecords({
  dbClient,
  tableName,
}: {
  dbClient: DbClient;
  tableName: keyof KyselySchema;
}) {
  if (!isTest()) throw new ForbiddenError('deleteAllRecords can only be used in test environment');
  if (envConfig.STAGE === STAGES.Prod)
    throw new ForbiddenError('deleteAllRecords can only be used with a non prod database');
  if (!envConfig.TEST_DB_URL.includes('@localhost'))
    throw new ForbiddenError('deleteAllRecords cannot be used with a localhost database');

  await sql`DELETE FROM ${sql.raw(tableName)}`.execute(dbClient);
}
