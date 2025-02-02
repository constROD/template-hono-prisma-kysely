import { verifyAccessToken } from '@/lib/jwt';
import { type Session } from '@/types/auth';
import { UnauthorizedError } from '@/utils/errors';
import { type Context, type Next } from 'hono';

export async function authenticationMiddleware(c: Context, next: Next) {
  const accessToken = c.req.header('Authorization')?.replace('Bearer ', '');

  if (!accessToken) throw new UnauthorizedError('Access token is required');

  const accessTokenPayload = verifyAccessToken(accessToken);

  if (!accessTokenPayload) throw new UnauthorizedError('Invalid access token');

  c.set('session', {
    id: accessTokenPayload.accountId,
    email: accessTokenPayload.email,
    accessToken,
  } satisfies Session);

  await next();
}
