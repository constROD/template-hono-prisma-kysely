import { userSchema } from '@/data/user/schema';
import { updateUserData } from '@/data/user/update-user';
import { type AuthenticatedUser } from '@/types/auth';
import { NotFoundError } from '@/utils/errors';
import { createRoute, type z } from '@hono/zod-openapi';
import { type Handler } from 'hono';

export const updateProfileBodySchema = userSchema
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
    deleted_at: true,
    email: true,
    role: true,
  })
  .partial();

export type UpdateProfileBody = z.infer<typeof updateProfileBodySchema>;

export const updateProfileRoute = createRoute({
  security: [{ bearerAuth: [] }],
  method: 'put',
  path: '/me',
  tags: ['Me'],
  description: 'Update user profile',
  request: {
    body: {
      content: {
        'application/json': {
          schema: updateProfileBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: userSchema,
        },
      },
      description: 'User profile updated successfully',
    },
  },
});

export const updateProfileHandler: Handler = async c => {
  const dbClient = c.get('dbClient');
  const authenticatedUser = c.get('authenticatedUser') as AuthenticatedUser;
  const body = await c.req.json<UpdateProfileBody>();

  const updatedUser = await updateUserData({ dbClient, id: authenticatedUser.id, values: body });

  if (!updatedUser) throw new NotFoundError('User not found');

  return c.json(updatedUser, { status: 200 });
};
