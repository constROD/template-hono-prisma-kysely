import { userSchema } from '@/data/user/schema';
import { updateUserData } from '@/data/user/update-user';
import { type Session } from '@/types/auth';
import { createRoute, type z } from '@hono/zod-openapi';
import { type Handler } from 'hono';

export const updateMyProfileSchema = {
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

export type UpdateMyProfileBody = z.infer<typeof updateMyProfileSchema.body>;
export type UpdateMyProfileResponse = z.infer<typeof updateMyProfileSchema.response>;

export const updateMyProfileRoute = createRoute({
  security: [{ bearerAuth: [] }],
  method: 'put',
  path: '/me',
  tags: ['Me'],
  description: 'Update my profile',
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

export const updateMyProfileHandler: Handler = async c => {
  const dbClient = c.get('dbClient');
  const session = c.get('session') as Session;
  const body = await c.req.json<UpdateMyProfileBody>();

  const updatedMyProfile = await updateUserData({ dbClient, id: session.id, values: body });

  return c.json<UpdateMyProfileResponse>(updatedMyProfile, { status: 200 });
};
