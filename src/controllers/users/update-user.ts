import { updateUser } from '@/data/user/update-user';
import { NotFoundError } from '@/utils/errors';
import { createRoute, z } from '@hono/zod-openapi';
import { type Handler } from 'hono';
import { updateUserSchema, userSchema, type UpdateUser } from './schema';

const schema = {
  params: z.object({
    userId: z
      .string()
      .uuid()
      .openapi({ param: { name: 'userId', in: 'path' }, example: crypto.randomUUID() }),
  }),
  body: updateUserSchema,
};

export const updateUserRoute = createRoute({
  method: 'put',
  path: '/users/{userId}',
  tags: ['Users'],
  request: {
    params: schema.params,
    body: {
      content: {
        'application/json': {
          schema: schema.body,
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
  const body = (await c.req.json()) as UpdateUser;
  const updatedUser = await updateUser({ dbClient, id: userId, values: body });

  if (!updatedUser) throw new NotFoundError('User not found');

  return c.json(updatedUser, { status: 200 });
};
