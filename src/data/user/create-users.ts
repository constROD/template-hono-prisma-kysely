import { type DbClient } from '@/db/create-db-client';
import { type CreateUser } from './schema';

export type CreateUsersDataArgs = {
  dbClient: DbClient;
  values: CreateUser | CreateUser[];
};

export async function createUsersData({ dbClient, values }: CreateUsersDataArgs) {
  const createdRecords = await dbClient.insertInto('users').values(values).returningAll().execute();

  return createdRecords;
}
