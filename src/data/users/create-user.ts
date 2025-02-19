import { type DbClient } from '@/db/create-db-client';
import { type CreateUser } from './schema';

export type CreateUserDataArgs = {
  dbClient: DbClient;
  values: CreateUser;
};

export async function createUserData({ dbClient, values }: CreateUserDataArgs) {
  const createdRecord = await dbClient
    .insertInto('users')
    .values({ ...values, email: values.email.trim().toLowerCase() })
    .returningAll()
    .executeTakeFirstOrThrow();
  return createdRecord;
}
