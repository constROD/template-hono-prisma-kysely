import { checkResetBlockedData } from '@/data/accounts/check-reset-blocked';
import { getAccountData } from '@/data/accounts/get-account';
import { setResetCodeData } from '@/data/accounts/set-reset-code';
import type { DbClient } from '@/db/create-db-client';
import { BadRequestError } from '@/utils/errors';
import { generateResetCode } from '@/utils/generate-reset-code';

export type RequestPasswordResetServiceDependencies = {
  getAccountData: typeof getAccountData;
  setResetCodeData: typeof setResetCodeData;
  checkResetBlockedData: typeof checkResetBlockedData;
  generateResetCode: typeof generateResetCode;
};

export type RequestPasswordResetServiceArgs = {
  dbClient: DbClient;
  email: string;
  dependencies?: RequestPasswordResetServiceDependencies;
};

export async function requestPasswordResetService({
  dbClient,
  email,
  dependencies = {
    getAccountData,
    setResetCodeData,
    checkResetBlockedData,
    generateResetCode,
  },
}: RequestPasswordResetServiceArgs) {
  // Check if account is blocked from reset attempts
  const blockStatus = await dependencies.checkResetBlockedData({
    dbClient,
    email,
  });

  if (blockStatus.blocked) {
    throw new BadRequestError(
      `Too many reset attempts. Please try again in ${blockStatus.minutesLeft} minutes.`
    );
  }

  // Get account (but don't reveal if it doesn't exist)
  const account = await dependencies.getAccountData({
    dbClient,
    email,
  });

  // Always return success even if account doesn't exist (security)
  if (!account) {
    return {
      success: true,
      message: 'If an account exists with this email, a reset code has been sent.',
    };
  }

  // Generate reset code
  const resetCode = dependencies.generateResetCode();

  // Save reset code to database
  await dependencies.setResetCodeData({
    dbClient,
    accountId: account.id,
    resetCode,
    expiresInMinutes: 5,
  });

  // // Send email with reset code
  // const emailTemplate = getForgotPasswordTemplate({
  //   email,
  //   resetCode,
  // });

  // await dependencies.sendEmail({
  //   env: envConfig,
  //   to: email,
  //   subject: emailTemplate.subject,
  //   html: emailTemplate.html,
  //   text: emailTemplate.text,
  // });

  return {
    success: true,
    message: 'If an account exists with this email, a reset code has been sent.',
  };
}

export type RequestPasswordResetServiceResponse = Awaited<
  ReturnType<typeof requestPasswordResetService>
>;
