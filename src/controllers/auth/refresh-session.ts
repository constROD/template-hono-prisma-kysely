import { COOKIE_NAMES } from '@/constants/cookies';
import { userSchemaOpenApi } from '@/data/users/schema';
import { envConfig } from '@/env';
import { authenticationMiddleware } from '@/middlewares/authentication';
import { refreshSessionAuthService } from '@/services/auth/refresh-session';
import { type Session } from '@/types/auth';
import { type AppRouteHandler } from '@/types/hono';
import { createRoute, type z } from '@hono/zod-openapi';
import { setSignedCookie } from 'hono/cookie';

export const refreshSessionAuthSchema = {
  response: userSchemaOpenApi,
};

export type RefreshSessionAuthResponse = z.infer<typeof refreshSessionAuthSchema.response>;

export const refreshSessionAuthRoute = createRoute({
  middleware: [authenticationMiddleware],
  security: [{ bearerAuth: [] }],
  method: 'post',
  path: '/auth/refresh-session',
  tags: ['Auth'],
  summary: 'Refresh session',
  description: 'Refresh the session of the user.',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: refreshSessionAuthSchema.response,
        },
      },
      description: 'Session refreshed successfully',
    },
  },
});

export const refreshSessionAuthRouteHandler: AppRouteHandler<
  typeof refreshSessionAuthRoute
> = async c => {
  const dbClient = c.get('dbClient');
  const session = c.get('session') as Session;

  const { user, accessToken, refreshToken } = await refreshSessionAuthService({
    dbClient,
    payload: { refreshToken: session.refreshToken },
  });

  await setSignedCookie(c, COOKIE_NAMES.accessToken, accessToken, envConfig.COOKIE_SECRET, {
    httpOnly: true, // Prevents JavaScript access
    secure: true, // Only sent over HTTPS
    sameSite: 'Strict', // Prevents cross-site request forgery
    path: '/', // Available across the entire site
    maxAge: 60 * 60 * 24 * 1, // 1 day (in seconds)
  });

  await setSignedCookie(c, COOKIE_NAMES.refreshToken, refreshToken, envConfig.COOKIE_SECRET, {
    httpOnly: true, // Prevents JavaScript access
    secure: true, // Only sent over HTTPS
    sameSite: 'Strict', // Prevents cross-site request forgery
    path: '/', // Available across the entire site
    maxAge: 60 * 60 * 24 * 30, // 30 days (in seconds)
  });

  return c.json(user, { status: 200 });
};
