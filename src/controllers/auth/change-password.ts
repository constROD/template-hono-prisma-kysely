import { authenticationMiddleware } from '@/middlewares/authentication';
import { changePasswordAuthService } from '@/services/auth/change-password';
import { type Session } from '@/types/auth';
import { type AppRouteHandler } from '@/types/hono';
import { passwordSchema } from '@/utils/zod-schemas';
import { createRoute, z } from '@hono/zod-openapi';

export const changePasswordAuthSchema = {
  body: z.object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
  }),
  response: z.string(),
};

export type ChangePasswordAuthBody = z.infer<typeof changePasswordAuthSchema.body>;
export type ChangePasswordAuthResponse = z.infer<typeof changePasswordAuthSchema.response>;

export const changePasswordAuthRoute = createRoute({
  middleware: [authenticationMiddleware],
  security: [{ bearerAuth: [] }],
  method: 'put',
  path: '/auth/change-password',
  tags: ['Auth'],
  summary: 'Change password',
  description: 'Change password for current account.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: changePasswordAuthSchema.body,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: changePasswordAuthSchema.response,
        },
      },
      description: 'Password changed successfully',
    },
  },
});

export const changePasswordAuthRouteHandler: AppRouteHandler<
  typeof changePasswordAuthRoute
> = async c => {
  const dbClient = c.get('dbClient');
  const session = c.get('session') as Session;
  const body = c.req.valid('json');

  await changePasswordAuthService({
    dbClient,
    payload: {
      session,
      currentPassword: body.currentPassword,
      newPassword: body.newPassword,
    },
  });

  return c.json('Password changed successfully', { status: 200 });
};
