import { userSchema } from '@/data/user/schema';
import { updateUserData } from '@/data/user/update-user';
import { NotFoundError } from '@/utils/errors';
import { createRoute, z } from '@hono/zod-openapi';
import { type Handler } from 'hono';

export const updateUserBodySchema = userSchema
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
    deleted_at: true,
    email: true,
  })
  .partial();

export type UpdateUserBody = z.infer<typeof updateUserBodySchema>;

export const updateUserRoute = createRoute({
  method: 'put',
  path: '/users/{userId}',
  tags: ['Users'],
  description: 'Update a user',
  request: {
    params: z.object({
      userId: z
        .string()
        .uuid()
        .openapi({ param: { name: 'userId', in: 'path' }, example: crypto.randomUUID() }),
    }),
    body: {
      content: {
        'application/json': {
          schema: updateUserBodySchema,
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
      description: 'User updated successfully',
    },
  },
});

export const updateUserHandler: Handler = async c => {
  const dbClient = c.get('dbClient');
  const userId = c.req.param('userId');
  const body = await c.req.json<UpdateUserBody>();
  const updatedUser = await updateUserData({ dbClient, id: userId, values: body });

  if (!updatedUser) throw new NotFoundError('User not found');

  return c.json(updatedUser, { status: 200 });
};
