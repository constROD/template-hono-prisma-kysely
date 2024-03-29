import { type DbClient } from '@/db/create-db-client';
import { type KyselyTables } from '@/db/schema';
import { type InsertObject } from 'kysely';

type CreateUserArgs = {
  dbClient: DbClient;
  values: InsertObject<KyselyTables, 'users'>;
};

export async function createUser({ dbClient, values }: CreateUserArgs) {
  const [createdUser] = await dbClient.insertInto('users').values(values).returningAll().execute();

  return createdUser;
}
