import { userSchema, userSchemaOpenApi } from '@/data/users/schema';
import { updateUserData } from '@/data/users/update-user';
import { authenticationMiddleware } from '@/middlewares/authentication';
import { type Session } from '@/types/auth';
import { type AppRouteHandler } from '@/types/hono';
import { createRoute, type z } from '@hono/zod-openapi';

export const updateMyProfileSchema = {
  body: userSchema
    .pick({
      first_name: true,
      last_name: true,
    })
    .partial(),
  response: userSchemaOpenApi,
};

export type UpdateMyProfileBody = z.infer<typeof updateMyProfileSchema.body>;
export type UpdateMyProfileResponse = z.infer<typeof updateMyProfileSchema.response>;

export const updateMyProfileRoute = createRoute({
  middleware: [authenticationMiddleware],
  security: [{ bearerAuth: [] }],
  method: 'put',
  path: '/me',
  tags: ['Me'],
  summary: 'Update my profile',
  description: 'Update your profile.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: updateMyProfileSchema.body,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: updateMyProfileSchema.response,
        },
      },
      description: 'My profile updated successfully',
    },
  },
});

export const updateMyProfileRouteHandler: AppRouteHandler<
  typeof updateMyProfileRoute
> = async c => {
  const dbClient = c.get('dbClient');
  const session = c.get('session') as Session;
  const body = c.req.valid('json');

  const updatedMyProfile = await updateUserData({ dbClient, id: session.accountId, values: body });

  return c.json(updatedMyProfile, { status: 200 });
};
