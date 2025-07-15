import { verifyResetCodeService } from '@/services/auth/verify-reset-code';
import type { AppRouteHandler } from '@/types/hono';
import { emailSchema } from '@/utils/zod-schemas';
import { createRoute, z } from '@hono/zod-openapi';

export const verifyResetCodeSchema = {
  body: z.object({
    email: emailSchema,
    code: z.string().length(6),
  }),
  response: z.object({
    reset_token: z.string(),
  }),
};

export type VerifyResetCodeBody = z.infer<typeof verifyResetCodeSchema.body>;
export type VerifyResetCodeResponse = z.infer<typeof verifyResetCodeSchema.response>;

export const verifyResetCodeRoute = createRoute({
  middleware: [],
  method: 'post',
  path: '/auth/reset-password/verify',
  tags: ['Auth'],
  summary: 'Verify password reset code',
  description: "Verify the 6-character reset code sent to the user's email.",
  request: {
    body: {
      content: {
        'application/json': {
          schema: verifyResetCodeSchema.body,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: verifyResetCodeSchema.response,
        },
      },
      description: 'Code verified successfully',
    },
  },
});

export const verifyResetCodeController: AppRouteHandler<typeof verifyResetCodeRoute> = async c => {
  const dbClient = c.get('dbClient');
  const { email, code } = c.req.valid('json');

  const result = await verifyResetCodeService({ dbClient, email, resetCode: code });

  return c.json({ reset_token: result.resetToken }, 200);
};
