import { type DbClient } from '@/db/create-db-client';
import { type KyselySchema } from '@/db/schema';
import { type InsertObjectOrList } from 'kysely/dist/cjs/parser/insert-values-parser';

export type CreateUsersDataArgs = {
  dbClient: DbClient;
  values: InsertObjectOrList<KyselySchema, 'users'>;
};

export async function createUsersData({ dbClient, values }: CreateUsersDataArgs) {
  const createdRecords = await dbClient.insertInto('users').values(values).returningAll().execute();

  return createdRecords;
}
