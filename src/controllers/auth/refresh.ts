import { COOKIE_NAMES } from '@/constants/cookies';
import { userSchemaOpenApi } from '@/data/users/schema';
import { envConfig } from '@/env';
import { authenticationMiddleware } from '@/middlewares/authentication';
import { refreshSessionAuthService } from '@/services/auth/refresh-session';
import type { Session } from '@/types/auth';
import type { AppRouteHandler } from '@/types/hono';
import { getAccessTokenCookieOptions, getRefreshTokenCookieOptions } from '@/utils/cookie-options';
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

  await setSignedCookie(
    c,
    COOKIE_NAMES.accessToken,
    accessToken,
    envConfig.COOKIE_SECRET,
    getAccessTokenCookieOptions(envConfig.STAGE)
  );
  await setSignedCookie(
    c,
    COOKIE_NAMES.refreshToken,
    refreshToken,
    envConfig.COOKIE_SECRET,
    getRefreshTokenCookieOptions(envConfig.STAGE)
  );

  const response = {
    user,
    access_token: accessToken,
    refresh_token: refreshToken,
  };

  return c.json(response, { status: 200 });
};
