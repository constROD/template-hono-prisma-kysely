import { getAccountData } from '@/data/account/get-account';
import { createSessionData } from '@/data/session/create-session';
import { revokeSessionData } from '@/data/session/revoke-session';
import { type DbClient } from '@/db/create-db-client';
import { compareTextToHashedText } from '@/lib/bcrypt';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { BadRequestError } from '@/utils/errors';

export type LoginAuthServiceDependencies = {
  getAccountData: typeof getAccountData;
  createSessionData: typeof createSessionData;
  revokeSessionData: typeof revokeSessionData;
  compareTextToHashedText: typeof compareTextToHashedText;
  generateAccessToken: typeof generateAccessToken;
  generateRefreshToken: typeof generateRefreshToken;
};

export type LoginAuthServiceArgs = {
  dbClient: DbClient;
  payload: { email: string; password: string };
  dependencies?: LoginAuthServiceDependencies;
};

export async function loginAuthService({
  dbClient,
  payload,
  dependencies = {
    getAccountData,
    createSessionData,
    revokeSessionData,
    compareTextToHashedText,
    generateAccessToken,
    generateRefreshToken,
  },
}: LoginAuthServiceArgs) {
  return await dbClient.transaction().execute(async dbClientTrx => {
    const existingAccount = await dependencies.getAccountData({
      dbClient: dbClientTrx,
      email: payload.email,
    });

    if (!existingAccount) {
      throw new BadRequestError('Account does not exist.');
    }

    const isPasswordCorrect = dependencies.compareTextToHashedText({
      text: payload.password,
      hashedText: existingAccount.password,
    });

    if (!isPasswordCorrect) {
      throw new BadRequestError('Password is incorrect.');
    }

    await dependencies.revokeSessionData({ dbClient: dbClientTrx, accountId: existingAccount.id });

    const refreshToken = dependencies.generateRefreshToken({
      payload: { accountId: existingAccount.id },
      options: { expiresIn: '30d' },
    });

    const createdSession = await dependencies.createSessionData({
      dbClient: dbClientTrx,
      values: { refresh_token: refreshToken, account_id: existingAccount.id },
    });

    const accessToken = dependencies.generateAccessToken({
      payload: {
        sessionId: createdSession.id,
        accountId: existingAccount.id,
        email: existingAccount.email,
      },
      options: { expiresIn: '1d', issuer: 'login', audience: 'frontend' },
    });

    return { accessToken };
  });
}
