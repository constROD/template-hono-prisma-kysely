import { revokeSessionData } from '@/data/session/revoke-session';
import { authenticationMiddleware } from '@/middlewares/authentication';
import { type Session } from '@/types/auth';
import { type AppRouteHandler } from '@/types/hono';
import { createRoute, z } from '@hono/zod-openapi';

export const logoutAuthSchema = {
  response: z.string(),
};

export type LogoutAuthResponse = z.infer<typeof logoutAuthSchema.response>;

export const logoutAuthRoute = createRoute({
  middleware: [authenticationMiddleware],
  security: [{ bearerAuth: [] }],
  method: 'delete',
  path: '/auth/logout',
  tags: ['Auth'],
  summary: 'Sign out',
  description: 'Sign out current session',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: logoutAuthSchema.response,
        },
      },
      description: 'Signed out successfully',
    },
  },
});

export const logoutAuthRouteHandler: AppRouteHandler<typeof logoutAuthRoute> = async c => {
  const dbClient = c.get('dbClient');
  const session = c.get('session') as Session;

  await revokeSessionData({
    dbClient,
    accountId: session.id,
  });

  return c.json('Signed out successfully', { status: 200 });
};
