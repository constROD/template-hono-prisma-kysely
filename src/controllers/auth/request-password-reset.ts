import { requestPasswordResetService } from '@/services/auth/request-password-reset';
import type { AppRouteHandler } from '@/types/hono';
import { emailSchema } from '@/utils/zod-schemas';
import { createRoute, z } from '@hono/zod-openapi';

export const requestPasswordResetSchema = {
  body: z.object({
    email: emailSchema,
  }),
  response: z.string(),
};

export type RequestPasswordResetBody = z.infer<typeof requestPasswordResetSchema.body>;
export type RequestPasswordResetResponse = z.infer<typeof requestPasswordResetSchema.response>;

export const requestPasswordResetRoute = createRoute({
  middleware: [],
  method: 'post',
  path: '/auth/reset-password/request',
  tags: ['Auth'],
  summary: 'Request password reset',
  description: "Send a password reset code to the user's email address.",
  request: {
    body: {
      content: {
        'application/json': {
          schema: requestPasswordResetSchema.body,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: requestPasswordResetSchema.response,
        },
      },
      description: 'Password reset request processed',
    },
  },
});

export const requestPasswordResetController: AppRouteHandler<
  typeof requestPasswordResetRoute
> = async c => {
  const dbClient = c.get('dbClient');
  const { email } = c.req.valid('json');

  const result = await requestPasswordResetService({ dbClient, email });

  return c.json(result.message, 200);
};
