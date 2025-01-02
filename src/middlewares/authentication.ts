// import { UnauthorizedError } from '@/utils/errors';
import { UnauthorizedError } from '@/utils/errors';
import { type Context, type Next } from 'hono';

export async function authenticationMiddleware(c: Context, next: Next) {
  const accessToken = c.req.header('Authorization')?.replace('Bearer ', '');

  if (!accessToken) throw new UnauthorizedError('Access token is required');

  // const user = getUserBasedOnAccessToken(accessToken);

  // if (!user) throw new UnauthorizedError('Invalid access token');

  /* TODO: Send the session user to the context */
  // c.set('session', { id: user.id, email: user.email });

  await next();
}
