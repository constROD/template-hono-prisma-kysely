import { type DbClient } from '@/db/create-db-client';
import { NotFoundError } from '@/utils/errors';
import { sql } from 'kysely';
import { type UpdateAccount } from './schema';

export type UpdateAccountDataArgs = {
  dbClient: DbClient;
  id: string;
  values: UpdateAccount;
};

export async function updateAccountData({ dbClient, id, values }: UpdateAccountDataArgs) {
  const updatedRecord = await dbClient
    .updateTable('accounts')
    .set({ ...values, updated_at: sql`NOW()` })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirstOrThrow(() => new NotFoundError('Account not found.'));

  return updatedRecord;
}
