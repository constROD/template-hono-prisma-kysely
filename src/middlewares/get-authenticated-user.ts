import { getUserData } from '@/data/user/get-user';
import { UnauthorizedError } from '@/utils/errors';
import { type Context, type Next } from 'hono';

export async function getAuthenticatedUserMiddleware(c: Context, next: Next) {
  const dbClient = c.get('dbClient');
  const sessionUserId = c.get('session')?.id;

  if (!sessionUserId) throw new UnauthorizedError('User is not authenticated.');

  const authenticatedUser = await getUserData({ dbClient, id: sessionUserId });

  c.set('authenticatedUser', authenticatedUser);

  await next();
}
