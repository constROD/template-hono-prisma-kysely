import { clearResetCodeData } from '@/data/accounts/clear-reset-code';
import { getAccountData } from '@/data/accounts/get-account';
import { updateAccountData } from '@/data/accounts/update-account';
import { revokeSessionData } from '@/data/sessions/revoke-session';
import type { DbClient } from '@/db/create-db-client';
import { envConfig } from '@/env';
import { hashText } from '@/lib/bcrypt';
import { verifyJWT } from '@/lib/jwt';
import { BadRequestError } from '@/utils/errors';

export type ResetPasswordServiceDependencies = {
  getAccountData: typeof getAccountData;
  updateAccountData: typeof updateAccountData;
  clearResetCodeData: typeof clearResetCodeData;
  revokeSessionData: typeof revokeSessionData;
  hashText: typeof hashText;
  verifyJWT: typeof verifyJWT;
};

export type ResetPasswordServiceArgs = {
  dbClient: DbClient;
  resetToken: string;
  newPassword: string;
  dependencies?: ResetPasswordServiceDependencies;
};

type ResetTokenPayload = {
  accountId: string;
  email: string;
  purpose: string;
};

export async function resetPasswordService({
  dbClient,
  resetToken,
  newPassword,
  dependencies = {
    getAccountData,
    updateAccountData,
    clearResetCodeData,
    revokeSessionData,
    hashText,
    verifyJWT,
  },
}: ResetPasswordServiceArgs) {
  // Verify the reset token
  let tokenPayload: ResetTokenPayload;
  try {
    const verifiedToken = dependencies.verifyJWT<ResetTokenPayload>({
      token: resetToken,
      secretOrPublicKey: envConfig.JWT_PASSWORD_TOKEN_SECRET,
    });

    if (!verifiedToken) {
      throw new BadRequestError('Invalid or expired reset token.');
    }

    tokenPayload = {
      accountId: verifiedToken.accountId,
      email: verifiedToken.email,
      purpose: verifiedToken.purpose,
    };
  } catch {
    throw new BadRequestError('Invalid or expired reset token.');
  }

  // Validate token purpose
  if (tokenPayload.purpose !== 'password-reset') {
    throw new BadRequestError('Invalid reset token.');
  }

  // Use transaction to ensure atomicity
  await dbClient.transaction().execute(async trx => {
    // Verify the reset code still exists in the database
    const account = await dependencies.getAccountData({
      dbClient,
      email: tokenPayload.email,
    });

    if (!account) {
      throw new BadRequestError('Account not found.');
    }

    // Check if reset code exists
    if (!account.reset_code) {
      throw new BadRequestError('Password reset token has already been used or is invalid.');
    }

    // Check if reset code has expired
    if (account.reset_code_expires && new Date(account.reset_code_expires) < new Date()) {
      throw new BadRequestError('Password reset token has expired.');
    }

    // Hash the new password
    const hashedPassword = dependencies.hashText({ text: newPassword });

    // Clear reset code fields first to prevent reuse
    await dependencies.clearResetCodeData({
      dbClient: trx,
      accountId: tokenPayload.accountId,
    });

    // Update password
    await dependencies.updateAccountData({
      dbClient: trx,
      id: tokenPayload.accountId,
      values: {
        password: hashedPassword,
      },
    });

    // Revoke all existing sessions for security
    await dependencies.revokeSessionData({
      dbClient: trx,
      accountId: tokenPayload.accountId,
    });
  });

  return {
    success: true,
    message: 'Password has been reset successfully. Please login with your new password.',
  };
}

export type ResetPasswordServiceResponse = Awaited<ReturnType<typeof resetPasswordService>>;
