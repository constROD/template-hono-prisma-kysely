import { type DbClient } from '@/db/create-db-client';
import { type CreateAccount } from './schema';

export type CreateAccountDataArgs = {
  dbClient: DbClient;
  values: CreateAccount;
};

export async function createAccountData({ dbClient, values }: CreateAccountDataArgs) {
  const createdRecord = await dbClient
    .insertInto('accounts')
    .values({ ...values, email: values.email.trim().toLowerCase() })
    .returningAll()
    .executeTakeFirstOrThrow();
  return createdRecord;
}
