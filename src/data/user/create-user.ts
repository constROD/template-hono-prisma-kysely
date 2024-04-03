import { type DbClient } from '@/db/create-db-client';
import { type KyselySchema } from '@/db/schema';
import { type InsertObject } from 'kysely';

type CreateUserArgs = {
  dbClient: DbClient;
  values: InsertObject<KyselySchema, 'users'>;
};

export async function createUser({ dbClient, values }: CreateUserArgs) {
  const [createdUser] = await dbClient.insertInto('users').values(values).returningAll().execute();

  return createdUser;
}
