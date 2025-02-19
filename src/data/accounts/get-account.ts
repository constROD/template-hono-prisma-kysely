import { type DbClient } from '@/db/create-db-client';
import { BadRequestError } from '@/utils/errors';

export type GetAccountDataArgs = {
  dbClient: DbClient;
  id?: string;
  email?: string;
};

export async function getAccountData({ dbClient, id, email }: GetAccountDataArgs) {
  if (!id && !email) {
    throw new BadRequestError('Either id or email must be provided.');
  }

  let baseQuery = dbClient.selectFrom('accounts');

  if (id) {
    baseQuery = baseQuery.where('id', '=', id);
  }

  if (email) {
    baseQuery = baseQuery.where('email', '=', email.trim().toLowerCase());
  }

  const record = await baseQuery.selectAll().executeTakeFirst();

  return record;
}
