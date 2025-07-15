import { resetPasswordService } from '@/services/auth/reset-password';
import type { AppRouteHandler } from '@/types/hono';
import { passwordSchema } from '@/utils/zod-schemas';
import { createRoute, z } from '@hono/zod-openapi';

export const resetPasswordSchema = {
  body: z.object({
    reset_token: z.string(),
    new_password: passwordSchema,
  }),
  response: z.string(),
};

export type ResetPasswordBody = z.infer<typeof resetPasswordSchema.body>;
export type ResetPasswordResponse = z.infer<typeof resetPasswordSchema.response>;

export const resetPasswordRoute = createRoute({
  middleware: [],
  method: 'post',
  path: '/auth/reset-password',
  tags: ['Auth'],
  summary: 'Reset password',
  description: "Reset the user's password using the temporary reset token.",
  request: {
    body: {
      content: {
        'application/json': {
          schema: resetPasswordSchema.body,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: resetPasswordSchema.response,
        },
      },
      description: 'Password reset successfully',
    },
  },
});

export const resetPasswordController: AppRouteHandler<typeof resetPasswordRoute> = async c => {
  const dbClient = c.get('dbClient');
  const { reset_token, new_password } = c.req.valid('json');

  const result = await resetPasswordService({
    dbClient,
    resetToken: reset_token,
    newPassword: new_password,
  });

  return c.json(result.message, 200);
};
