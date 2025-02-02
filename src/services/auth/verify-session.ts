import { getSessionData } from '@/data/session/get-session';
import { revokeSessionData } from '@/data/session/revoke-session';
import { updateSessionData } from '@/data/session/update-session';
import { type DbClient } from '@/db/create-db-client';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '@/lib/jwt';
import { BadRequestError } from '@/utils/errors';

export type VerifySessionServiceDependencies = {
  getSessionData: typeof getSessionData;
  revokeSessionData: typeof revokeSessionData;
  updateSessionData: typeof updateSessionData;
  generateAccessToken: typeof generateAccessToken;
  generateRefreshToken: typeof generateRefreshToken;
  verifyAccessToken: typeof verifyAccessToken;
  verifyRefreshToken: typeof verifyRefreshToken;
};

export type VerifySessionServiceArgs = {
  dbClient: DbClient;
  payload: { accessToken: string };
  dependencies?: VerifySessionServiceDependencies;
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
    verifyAccessToken,
    verifyRefreshToken,
  },
}: VerifySessionServiceArgs) {
  return await dbClient.transaction().execute(async dbClientTrx => {
    const accessTokenPayload = dependencies.verifyAccessToken(payload.accessToken);

    if (!accessTokenPayload) {
      throw new BadRequestError('Invalid access token.');
    }

    const session = await dependencies.getSessionData({
      dbClient: dbClientTrx,
      id: accessTokenPayload.sessionId,
    });

    const refreshTokenPayload = dependencies.verifyRefreshToken(session.refresh_token);

    if (!refreshTokenPayload) {
      throw new BadRequestError('Invalid refresh token.');
    }

    if (refreshTokenPayload.accountId !== accessTokenPayload.accountId) {
      throw new BadRequestError('Refresh token does not match access token.');
    }

    const newRefreshToken = dependencies.generateRefreshToken({
      payload: { accountId: accessTokenPayload.accountId },
      options: { expiresIn: '30d' },
    });

    const updatedSession = await dependencies.updateSessionData({
      dbClient: dbClientTrx,
      id: session.id,
      values: { refresh_token: newRefreshToken },
    });

    const accessToken = dependencies.generateAccessToken({
      payload: {
        sessionId: updatedSession.id,
        accountId: accessTokenPayload.accountId,
        email: accessTokenPayload.email,
      },
      options: { expiresIn: '1d', issuer: 'refresh', audience: 'frontend' },
    });

    return {
      accountId: accessTokenPayload.accountId,
      email: accessTokenPayload.email,
      accessToken,
    };
  });
}
