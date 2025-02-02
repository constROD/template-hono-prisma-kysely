import { authenticationMiddleware } from '@/middlewares/authentication';
import { verifySessionAuthService } from '@/services/auth/verify-session';
import { type Session } from '@/types/auth';
import { type AppRouteHandler } from '@/types/hono';
import { createRoute, z } from '@hono/zod-openapi';

export const verifySessionAuthSchema = {
  response: z.object({
    access_token: z.string(),
    id: z.string(),
    email: z.string(),
  }),
};

export type VerifySessionAuthResponse = z.infer<typeof verifySessionAuthSchema.response>;

export const verifySessionAuthRoute = createRoute({
  middleware: [authenticationMiddleware],
  security: [{ bearerAuth: [] }],
  method: 'get',
  path: '/auth/verify-session',
  tags: ['Auth'],
  summary: 'Verify session',
  description: 'Verify the session of the user.',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: verifySessionAuthSchema.response,
        },
      },
      description: 'Session verified successfully',
    },
  },
});

export const verifySessionAuthRouteHandler: AppRouteHandler<
  typeof verifySessionAuthRoute
> = async c => {
  const dbClient = c.get('dbClient');
  const session = c.get('session') as Session;

  const { accessToken, accountId, email } = await verifySessionAuthService({
    dbClient,
    payload: { accessToken: session.accessToken },
  });

  const response = {
    id: accountId,
    email,
    access_token: accessToken,
  };

  return c.json(response, { status: 200 });
};
