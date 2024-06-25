import { userSchema } from '@/data/user/schema';
import { updateUserData } from '@/data/user/update-user';
import { type AuthenticatedUser } from '@/types/auth';
import { NotFoundError } from '@/utils/errors';
import { createRoute, type z } from '@hono/zod-openapi';
import { type Handler } from 'hono';

export const updateProfileSchema = {
  body: userSchema
    .omit({
      id: true,
      created_at: true,
      updated_at: true,
      deleted_at: true,
      email: true,
      role: true,
    })
    .partial(),
  response: userSchema,
};

export type UpdateProfileBody = z.infer<typeof updateProfileSchema.body>;
export type UpdateProfileResponse = z.infer<typeof updateProfileSchema.response>;

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
          schema: updateProfileSchema.body,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: updateProfileSchema.response,
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

  const updatedProfile = await updateUserData({ dbClient, id: authenticatedUser.id, values: body });

  if (!updatedProfile) throw new NotFoundError('User not found');

  return c.json<UpdateProfileResponse>(updatedProfile, { status: 200 });
};
