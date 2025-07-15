import type { DbClient } from '@/db/create-db-client';

export type CheckResetBlockedDataArgs = {
  dbClient: DbClient;
  email: string;
};

export async function checkResetBlockedData({
  dbClient,
  email,
}: CheckResetBlockedDataArgs) {
  const account = await dbClient
    .selectFrom('accounts')
    .where('email', '=', email)
    .where('deleted_at', 'is', null)
    .select(['id', 'reset_blocked_until'])
    .executeTakeFirst();

  if (!account) {
    return { blocked: false, minutesLeft: 0 };
  }

  if (!account.reset_blocked_until) {
    return { blocked: false, minutesLeft: 0 };
  }

  const blockedUntil = new Date(account.reset_blocked_until);
  const now = new Date();

  if (blockedUntil <= now) {
    return { blocked: false, minutesLeft: 0 };
  }

  const minutesLeft = Math.ceil((blockedUntil.getTime() - now.getTime()) / 1000 / 60);
  return { blocked: true, minutesLeft };
}

export type CheckResetBlockedDataResponse = Awaited<ReturnType<typeof checkResetBlockedData>>;