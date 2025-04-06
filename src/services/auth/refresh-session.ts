import { getSessionData } from '@/data/sessions/get-session';
import { revokeSessionData } from '@/data/sessions/revoke-session';
import { updateSessionData } from '@/data/sessions/update-session';
import { getUserData } from '@/data/users/get-user';
import { type DbClient } from '@/db/create-db-client';
import { envConfig } from '@/env';
import { decodeJWT, generateJWT, verifyJWT } from '@/lib/jwt';
import { type AccessTokenJWTPayload, type RefreshTokenJWTPayload } from '@/types/auth';
import { UnauthorizedError } from '@/utils/errors';

export type RefreshSessionAuthServiceDependencies = {
  getSessionData: typeof getSessionData;
  revokeSessionData: typeof revokeSessionData;
  updateSessionData: typeof updateSessionData;
  getUserData: typeof getUserData;
  verifyJWT: typeof verifyJWT;
  generateJWT: typeof generateJWT;
  decodeJWT: typeof decodeJWT;
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
    verifyJWT,
    generateJWT,
    decodeJWT,
  },
}: RefreshSessionAuthServiceArgs) {
  return await dbClient.transaction().execute(async dbClientTrx => {
    const refreshTokenPayload = dependencies.decodeJWT<RefreshTokenJWTPayload>({
      token: payload.refreshToken,
    });

    if (!refreshTokenPayload) {
      throw new UnauthorizedError('Refresh token is invalid.');
    }

    dependencies.verifyJWT<RefreshTokenJWTPayload>({
      token: payload.refreshToken,
      secretOrPublicKey: envConfig.JWT_REFRESH_TOKEN_SECRET,
    });

    const currentSession = await dependencies.getSessionData({
      dbClient: dbClientTrx,
      accountId: refreshTokenPayload.accountId,
    });

    if (currentSession.refresh_token !== payload.refreshToken) {
      throw new UnauthorizedError('Refresh token is invalid.');
    }

    const newRefreshToken = dependencies.generateJWT<RefreshTokenJWTPayload>({
      payload: {
        accountId: refreshTokenPayload.accountId,
        sub: refreshTokenPayload.sub,
        iss: 'refresh',
        aud: 'frontend',
      },
      secretOrPrivateKey: envConfig.JWT_REFRESH_TOKEN_SECRET,
      signOptions: { expiresIn: '30d' },
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

    const newAccessToken = dependencies.generateJWT<AccessTokenJWTPayload>({
      payload: {
        email: user.email,
        accountId: user.id,
        sessionId: updatedSession.id,
        sub: user.id,
        iss: 'refresh',
        aud: 'frontend',
      },
      secretOrPrivateKey: envConfig.JWT_ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '5m' },
    });

    return {
      user,
      sessionId: updatedSession.id,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  });
}
