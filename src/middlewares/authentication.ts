import { COOKIE_NAMES } from '@/constants/cookies';
import { envConfig } from '@/env';
import { decodeJWT, verifyJWT } from '@/lib/jwt';
import { refreshSessionAuthService } from '@/services/auth/refresh-session';
import { type AccessTokenJWTPayload, type Session } from '@/types/auth';
import { makeError, UnauthorizedError } from '@/utils/errors';
import { type Context, type Next } from 'hono';
import { getSignedCookie, setSignedCookie } from 'hono/cookie';

export async function authenticationMiddleware(c: Context, next: Next) {
  const dbClient = c.get('dbClient');

  const storedAccessToken = await getSignedCookie(
    c,
    envConfig.COOKIE_SECRET,
    COOKIE_NAMES.accessToken
  );
  const storedRefreshToken = await getSignedCookie(
    c,
    envConfig.COOKIE_SECRET,
    COOKIE_NAMES.refreshToken
  );

  if (!storedAccessToken || !storedRefreshToken) {
    throw new UnauthorizedError('Session tokens are required');
  }

  if (typeof storedAccessToken !== 'string' || typeof storedRefreshToken !== 'string') {
    throw new UnauthorizedError('Session tokens are invalid');
  }

  async function refreshSession({
    session,
    refreshToken,
  }: {
    session: Session;
    refreshToken: string;
  }) {
    const {
      user,
      sessionId,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    } = await refreshSessionAuthService({ dbClient, payload: { session, refreshToken } });

    c.set('session', {
      email: user.email,
      accountId: user.id,
      sessionId,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    } satisfies Session);

    await setSignedCookie(c, COOKIE_NAMES.accessToken, newAccessToken, envConfig.COOKIE_SECRET, {
      httpOnly: true, // Prevents JavaScript access
      secure: true, // Only sent over HTTPS
      sameSite: 'Strict', // Prevents cross-site request forgery
      path: '/', // Available across the entire site
      maxAge: 60 * 60 * 24 * 1, // 1 day (in seconds)
    });

    await setSignedCookie(c, COOKIE_NAMES.refreshToken, newRefreshToken, envConfig.COOKIE_SECRET, {
      httpOnly: true, // Prevents JavaScript access
      secure: true, // Only sent over HTTPS
      sameSite: 'Strict', // Prevents cross-site request forgery
      path: '/', // Available across the entire site
      maxAge: 60 * 60 * 24 * 30, // 30 days (in seconds)
    });
  }

  const storedAccessTokenPayload = decodeJWT<AccessTokenJWTPayload>({
    token: storedAccessToken,
  });

  if (!storedAccessTokenPayload) {
    throw new UnauthorizedError('Session tokens are invalid');
  }

  try {
    verifyJWT<AccessTokenJWTPayload>({
      token: storedAccessToken,
      secretOrPublicKey: envConfig.JWT_ACCESS_TOKEN_SECRET,
    });

    c.set('session', {
      email: storedAccessTokenPayload.email,
      accountId: storedAccessTokenPayload.accountId,
      sessionId: storedAccessTokenPayload.sessionId,
      accessToken: storedAccessToken,
      refreshToken: storedRefreshToken,
    } satisfies Session);
  } catch (err) {
    const error = makeError(err as Error);
    if (error.error.message === 'Token expired') {
      await refreshSession({
        session: {
          email: storedAccessTokenPayload.email,
          accountId: storedAccessTokenPayload.accountId,
          sessionId: storedAccessTokenPayload.sessionId,
          accessToken: storedAccessToken,
          refreshToken: storedRefreshToken,
        },
        refreshToken: storedRefreshToken,
      });
    } else {
      throw new UnauthorizedError('Session tokens are invalid');
    }
  }

  await next();
}
