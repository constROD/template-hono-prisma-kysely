import { COOKIE_NAMES } from '@/constants/cookies';
import { envConfig } from '@/env';
import { loginAuthService } from '@/services/auth/login';
import { type AppRouteHandler } from '@/types/hono';
import { emailSchema, passwordSchema } from '@/utils/zod-schemas';
import { createRoute, z } from '@hono/zod-openapi';
import { setSignedCookie } from 'hono/cookie';

export const loginAuthSchema = {
  body: z.object({ email: emailSchema, password: passwordSchema }),
  response: z.object({
    access_token: z.string(),
    refresh_token: z.string(),
  }),
};

export type LoginAuthBody = z.infer<typeof loginAuthSchema.body>;
export type LoginAuthResponse = z.infer<typeof loginAuthSchema.response>;

export const loginAuthRoute = createRoute({
  middleware: [],
  security: [{ bearerAuth: [] }],
  method: 'post',
  path: '/auth/login',
  tags: ['Auth'],
  summary: 'Login to account',
  description: 'Login to your account.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: loginAuthSchema.body,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: loginAuthSchema.response,
        },
      },
      description: 'Login successfully',
    },
  },
});

export const loginAuthRouteHandler: AppRouteHandler<typeof loginAuthRoute> = async c => {
  const dbClient = c.get('dbClient');
  const body = c.req.valid('json');

  const { accessToken, refreshToken } = await loginAuthService({ dbClient, payload: body });

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
    access_token: accessToken,
    refresh_token: refreshToken,
  };

  return c.json(response, { status: 200 });
};
