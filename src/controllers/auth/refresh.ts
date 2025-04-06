import { COOKIE_NAMES } from '@/constants/cookies';
import { userSchemaOpenApi } from '@/data/users/schema';
import { envConfig } from '@/env';
import { authenticationMiddleware } from '@/middlewares/authentication';
import { refreshSessionAuthService } from '@/services/auth/refresh-session';
import { type Session } from '@/types/auth';
import { type AppRouteHandler } from '@/types/hono';
import { createRoute, z } from '@hono/zod-openapi';
import { setSignedCookie } from 'hono/cookie';

export const refreshAuthSchema = {
  response: z.object({
    user: userSchemaOpenApi,
    access_token: z.string(),
    refresh_token: z.string(),
  }),
};

export type RefreshAuthResponse = z.infer<typeof refreshAuthSchema.response>;

export const refreshAuthRoute = createRoute({
  middleware: [authenticationMiddleware],
  security: [{ bearerAuth: [] }],
  method: 'post',
  path: '/auth/refresh',
  tags: ['Auth'],
  summary: 'Refresh session',
  description: 'Refresh the session of the user.',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: refreshAuthSchema.response,
        },
      },
      description: 'Session refreshed successfully',
    },
  },
});

export const refreshAuthRouteHandler: AppRouteHandler<typeof refreshAuthRoute> = async c => {
  const dbClient = c.get('dbClient');
  const session = c.get('session') as Session;

  const { user, accessToken, refreshToken } = await refreshSessionAuthService({
    dbClient,
    payload: { session, refreshToken: session.refreshToken },
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

  const response = {
    user,
    access_token: accessToken,
    refresh_token: refreshToken,
  };

  return c.json(response, { status: 200 });
};
