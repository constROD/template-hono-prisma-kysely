import type { DbClient } from '@/db/create-db-client';
import { sql } from 'kysely';
import { NotFoundError } from '@/utils/errors';

export type VerifyResetCodeDataArgs = {
  dbClient: DbClient;
  email: string;
  resetCode: string;
};

export async function verifyResetCodeData({
  dbClient,
  email,
  resetCode,
}: VerifyResetCodeDataArgs) {
  // Get account with reset code info
  const account = await dbClient
    .selectFrom('accounts')
    .where('email', '=', email)
    .where('deleted_at', 'is', null)
    .selectAll()
    .executeTakeFirst();

  if (!account) {
    throw new NotFoundError('Account not found.');
  }

  // Check if blocked
  if (account.reset_blocked_until && new Date(account.reset_blocked_until) > new Date()) {
    const blockedUntil = new Date(account.reset_blocked_until);
    const minutesLeft = Math.ceil((blockedUntil.getTime() - Date.now()) / 1000 / 60);
    return {
      success: false,
      blocked: true,
      minutesLeft,
      account,
    };
  }

  // Check if code exists
  if (!account.reset_code) {
    return {
      success: false,
      blocked: false,
      error: 'No reset code found',
      account,
    };
  }

  // Check if code expired
  if (account.reset_code_expires && new Date(account.reset_code_expires) < new Date()) {
    return {
      success: false,
      blocked: false,
      error: 'Reset code expired',
      account,
    };
  }

  // Check if code matches (case-insensitive)
  if (account.reset_code.toUpperCase() !== resetCode.toUpperCase()) {
    // Increment attempts
    const newAttempts = account.reset_attempts + 1;
    const shouldBlock = newAttempts >= 3;

    await dbClient
      .updateTable('accounts')
      .set({
        reset_attempts: newAttempts,
        reset_blocked_until: shouldBlock
          ? sql`NOW() + INTERVAL '15 minutes'`
          : null,
        updated_at: sql`NOW()`,
      })
      .where('id', '=', account.id)
      .execute();

    return {
      success: false,
      blocked: shouldBlock,
      attemptsLeft: Math.max(0, 3 - newAttempts),
      error: 'Invalid code',
      account,
    };
  }

  // Code is valid
  return {
    success: true,
    blocked: false,
    account,
  };
}

export type VerifyResetCodeDataResponse = Awaited<ReturnType<typeof verifyResetCodeData>>;