import { verifySessionAuthService } from '@/services/auth/get-new-tokens';
import { type AppRouteHandler } from '@/types/hono';
import { createRoute, z } from '@hono/zod-openapi';

export const tokenAuthSchema = {
  body: z.object({
    refresh_token: z.string(),
  }),
  response: z.object({
    access_token: z.string(),
    refresh_token: z.string(),
  }),
};

export type TokenAuthResponse = z.infer<typeof tokenAuthSchema.response>;

export const tokenAuthRoute = createRoute({
  middleware: [],
  security: [{ bearerAuth: [] }],
  method: 'post',
  path: '/auth/token',
  tags: ['Auth'],
  summary: 'Get new auth tokens',
  description: 'Get new access token & refresh token.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: tokenAuthSchema.body,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: tokenAuthSchema.response,
        },
      },
      description: 'Auth tokens generated successfully',
    },
  },
});

export const tokenAuthRouteHandler: AppRouteHandler<typeof tokenAuthRoute> = async c => {
  const dbClient = c.get('dbClient');
  const body = c.req.valid('json');

  const { accessToken, refreshToken } = await verifySessionAuthService({
    dbClient,
    payload: { refreshToken: body.refresh_token },
  });

  const response = {
    access_token: accessToken,
    refresh_token: refreshToken,
  };

  return c.json(response, { status: 200 });
};
