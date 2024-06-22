import { type DbClient } from '@/db/create-db-client';
import { type KyselySchema } from '@/db/schema';
import { type InsertObject } from 'kysely';

type CreateUserDataArgs = {
  dbClient: DbClient;
  values: InsertObject<KyselySchema, 'users'>;
};

export async function createUserData({ dbClient, values }: CreateUserDataArgs) {
  const [createdRecord] = await dbClient
    .insertInto('users')
    .values(values)
    .returningAll()
    .execute();

  return createdRecord;
}
