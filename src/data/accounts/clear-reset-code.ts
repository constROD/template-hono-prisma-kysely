import type { DbClient } from '@/db/create-db-client';
import { sql } from 'kysely';
import { NotFoundError } from '@/utils/errors';

export type ClearResetCodeDataArgs = {
  dbClient: DbClient;
  accountId: string;
};

export async function clearResetCodeData({
  dbClient,
  accountId,
}: ClearResetCodeDataArgs) {
  const updatedAccount = await dbClient
    .updateTable('accounts')
    .set({
      reset_code: null,
      reset_code_expires: null,
      reset_attempts: 0,
      reset_blocked_until: null,
      updated_at: sql`NOW()`,
    })
    .where('id', '=', accountId)
    .where('deleted_at', 'is', null)
    .returningAll()
    .executeTakeFirstOrThrow(() => new NotFoundError('Account not found.'));

  return updatedAccount;
}

export type ClearResetCodeDataResponse = Awaited<ReturnType<typeof clearResetCodeData>>;