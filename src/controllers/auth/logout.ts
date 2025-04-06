import { COOKIE_NAMES } from '@/constants/cookies';
import { revokeSessionData } from '@/data/sessions/revoke-session';
import { authenticationMiddleware } from '@/middlewares/authentication';
import { type Session } from '@/types/auth';
import { type AppRouteHandler } from '@/types/hono';
import { createRoute, z } from '@hono/zod-openapi';
import { deleteCookie } from 'hono/cookie';

export const logoutAuthSchema = {
  response: z.string(),
};

export const logoutAuthRoute = createRoute({
  middleware: [authenticationMiddleware],
  security: [{ bearerAuth: [] }],
  method: 'delete',
  path: '/auth/logout',
  tags: ['Auth'],
  summary: 'Logout user',
  description: 'Logout user by invalidating cookies',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: logoutAuthSchema.response,
        },
      },
      description: 'Logout successful',
    },
  },
});

export const logoutAuthRouteHandler: AppRouteHandler<typeof logoutAuthRoute> = async c => {
  const dbClient = c.get('dbClient');
  const session = c.get('session') as Session;

  deleteCookie(c, COOKIE_NAMES.accessToken, {
    path: '/',
    secure: true,
    httpOnly: true,
  });

  deleteCookie(c, COOKIE_NAMES.refreshToken, {
    path: '/',
    secure: true,
    httpOnly: true,
  });

  await revokeSessionData({ dbClient, accountId: session.accountId });

  return c.json('Logged out successfully', { status: 200 });
};
