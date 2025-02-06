import { getSessionData } from '@/data/session/get-session';
import { revokeSessionData } from '@/data/session/revoke-session';
import { updateSessionData } from '@/data/session/update-session';
import { type DbClient } from '@/db/create-db-client';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '@/lib/jwt';
import { BadRequestError } from '@/utils/errors';

export type GetNewTokensServiceDependencies = {
  getSessionData: typeof getSessionData;
  revokeSessionData: typeof revokeSessionData;
  updateSessionData: typeof updateSessionData;
  generateAccessToken: typeof generateAccessToken;
  generateRefreshToken: typeof generateRefreshToken;
  verifyRefreshToken: typeof verifyRefreshToken;
};

export type GetNewTokensServiceArgs = {
  dbClient: DbClient;
  payload: { refreshToken: string };
  dependencies?: GetNewTokensServiceDependencies;
};

export async function verifySessionAuthService({
  dbClient,
  payload,
  dependencies = {
    getSessionData,
    revokeSessionData,
    updateSessionData,
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
  },
}: GetNewTokensServiceArgs) {
  return await dbClient.transaction().execute(async dbClientTrx => {
    const refreshTokenPayload = dependencies.verifyRefreshToken(payload.refreshToken);

    const session = await dependencies.getSessionData({
      dbClient: dbClientTrx,
      refreshToken: payload.refreshToken,
    });

    if (!refreshTokenPayload) {
      throw new BadRequestError('Invalid refresh token.');
    }

    if (!session) {
      throw new BadRequestError('Refresh token has already been used.');
    }

    if (refreshTokenPayload.accountId !== session.account_id) {
      throw new BadRequestError('Refresh token does not match the session account.');
    }

    const newRefreshToken = dependencies.generateRefreshToken({
      payload: { accountId: session.account_id, email: refreshTokenPayload.email },
      options: { expiresIn: '1h' },
    });

    const updatedSession = await dependencies.updateSessionData({
      dbClient: dbClientTrx,
      id: session.id,
      values: { refresh_token: newRefreshToken },
    });

    const newAccessToken = dependencies.generateAccessToken({
      payload: {
        sessionId: updatedSession.id,
        accountId: session.account_id,
        email: refreshTokenPayload.email,
      },
      options: { expiresIn: '5m', issuer: 'refresh', audience: 'frontend' },
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  });
}
