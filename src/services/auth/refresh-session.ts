import { getSessionData } from '@/data/session/get-session';
import { revokeSessionData } from '@/data/session/revoke-session';
import { updateSessionData } from '@/data/session/update-session';
import { getUserData } from '@/data/user/get-user';
import { type DbClient } from '@/db/create-db-client';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '@/lib/jwt';
import { UnauthorizedError } from '@/utils/errors';

export type RefreshSessionAuthServiceDependencies = {
  getSessionData: typeof getSessionData;
  revokeSessionData: typeof revokeSessionData;
  updateSessionData: typeof updateSessionData;
  getUserData: typeof getUserData;
  verifyRefreshToken: typeof verifyRefreshToken;
  generateAccessToken: typeof generateAccessToken;
  generateRefreshToken: typeof generateRefreshToken;
};

export type RefreshSessionAuthServiceArgs = {
  dbClient: DbClient;
  payload: { refreshToken: string };
  dependencies?: RefreshSessionAuthServiceDependencies;
};

export async function refreshSessionAuthService({
  dbClient,
  payload,
  dependencies = {
    getSessionData,
    revokeSessionData,
    updateSessionData,
    getUserData,
    verifyRefreshToken,
    generateAccessToken,
    generateRefreshToken,
  },
}: RefreshSessionAuthServiceArgs) {
  return await dbClient.transaction().execute(async dbClientTrx => {
    const refreshTokenPayload = dependencies.verifyRefreshToken(payload.refreshToken);

    if (!refreshTokenPayload) {
      throw new UnauthorizedError('Refresh token is expired.');
    }

    const currentSession = await dependencies.getSessionData({
      dbClient: dbClientTrx,
      accountId: refreshTokenPayload.accountId,
    });

    if (currentSession.refresh_token !== payload.refreshToken) {
      throw new UnauthorizedError('Refresh token is invalid.');
    }

    const newRefreshToken = dependencies.generateRefreshToken({
      payload: { accountId: currentSession.account_id },
      options: { expiresIn: '30d' },
    });

    const updatedSession = await dependencies.updateSessionData({
      dbClient: dbClientTrx,
      id: currentSession.id,
      values: { refresh_token: newRefreshToken },
    });

    const user = await dependencies.getUserData({
      dbClient: dbClientTrx,
      id: refreshTokenPayload.accountId,
    });

    const newAccessToken = dependencies.generateAccessToken({
      payload: {
        sessionId: updatedSession.id,
        accountId: user.id,
        email: user.email,
      },
      options: { expiresIn: '5m', issuer: 'refresh', audience: 'frontend' },
    });

    return {
      user,
      sessionId: updatedSession.id,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  });
}
