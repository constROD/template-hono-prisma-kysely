import type { DbClient } from '@/db/create-db-client';
import { sql } from 'kysely';

export type SetResetCodeDataArgs = {
  dbClient: DbClient;
  accountId: string;
  resetCode: string;
  expiresInMinutes?: number;
};

export async function setResetCodeData({
  dbClient,
  accountId,
  resetCode,
  expiresInMinutes = 10,
}: SetResetCodeDataArgs) {
  const updatedAccount = await dbClient
    .updateTable('accounts')
    .set({
      reset_code: resetCode,
      reset_code_expires: sql`NOW() + INTERVAL '${sql.raw(expiresInMinutes.toString())} minutes'`,
      reset_attempts: 0,
      reset_blocked_until: null,
      updated_at: sql`NOW()`,
    })
    .where('id', '=', accountId)
    .where('deleted_at', 'is', null)
    .returningAll()
    .executeTakeFirstOrThrow();

  return updatedAccount;
}

export type SetResetCodeDataResponse = Awaited<ReturnType<typeof setResetCodeData>>;