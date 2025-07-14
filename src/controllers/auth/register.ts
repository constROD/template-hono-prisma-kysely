import { COOKIE_NAMES } from '@/constants/cookies';
import { envConfig } from '@/env';
import { loginAuthService } from '@/services/auth/login';
import { registerAuthService } from '@/services/auth/register';
import type { AppRouteHandler } from '@/types/hono';
import { getAccessTokenCookieOptions, getRefreshTokenCookieOptions } from '@/utils/cookie-options';
import { emailSchema, passwordSchema } from '@/utils/zod-schemas';
import { createRoute, z } from '@hono/zod-openapi';
import { setSignedCookie } from 'hono/cookie';

export const registerAuthSchema = {
  body: z.object({ email: emailSchema, password: passwordSchema }),
  response: z.string(),
};

export type RegisterAuthBody = z.infer<typeof registerAuthSchema.body>;
export type RegisterAuthResponse = z.infer<typeof registerAuthSchema.response>;

export const registerAuthRoute = createRoute({
  middleware: [],
  security: [{ bearerAuth: [] }],
  method: 'post',
  path: '/auth/register',
  tags: ['Auth'],
  summary: 'Register new user',
  description: 'Register a new user.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: registerAuthSchema.body,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: registerAuthSchema.response,
        },
      },
      description: 'Account registered successfully',
    },
  },
});

export const registerAuthRouteHandler: AppRouteHandler<typeof registerAuthRoute> = async c => {
  const dbClient = c.get('dbClient');
  const body = c.req.valid('json');

  await registerAuthService({ dbClient, payload: body });

  const { accessToken, refreshToken } = await loginAuthService({ dbClient, payload: body });

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

  return c.json('Account registered successfully', { status: 201 });
};
