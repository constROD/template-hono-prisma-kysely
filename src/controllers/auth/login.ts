import { loginAuthService } from '@/services/auth/login';
import { type AppRouteHandler } from '@/types/hono';
import { emailSchema, passwordSchema } from '@/utils/zod-schemas';
import { createRoute, z } from '@hono/zod-openapi';

export const loginAuthSchema = {
  body: z.object({ email: emailSchema, password: passwordSchema }),
  response: z.object({ access_token: z.string() }),
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

  const { accessToken } = await loginAuthService({ dbClient, payload: body });

  return c.json({ access_token: accessToken }, { status: 200 });
};
