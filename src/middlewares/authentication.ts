import { COOKIE_NAMES } from '@/constants/cookies';
import { envConfig } from '@/env';
import { verifyAccessToken } from '@/lib/jwt';
import { refreshSessionAuthService } from '@/services/auth/refresh-session';
import { type Session } from '@/types/auth';
import { UnauthorizedError } from '@/utils/errors';
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

  async function refreshSession(refreshToken: string) {
    const {
      user,
      sessionId,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    } = await refreshSessionAuthService({ dbClient, payload: { refreshToken } });

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

  try {
    const storedAccessTokenPayload = verifyAccessToken(storedAccessToken);

    if (storedAccessTokenPayload) {
      c.set('session', {
        email: storedAccessTokenPayload.email,
        accountId: storedAccessTokenPayload.accountId,
        sessionId: storedAccessTokenPayload.sessionId,
        accessToken: storedAccessToken,
        refreshToken: storedRefreshToken,
      } satisfies Session);
    } else {
      await refreshSession(storedRefreshToken);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('jwt expired')) {
      await refreshSession(storedRefreshToken);
    } else {
      throw new UnauthorizedError('Session tokens are invalid');
    }
  }

  await next();
}
