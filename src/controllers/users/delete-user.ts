import { deleteUserData } from '@/data/user/delete-user';
import { NotFoundError } from '@/utils/errors';
import { createRoute, z } from '@hono/zod-openapi';
import { type Handler } from 'hono';
import { userSchema } from './schema';

export const deleteUserRoute = createRoute({
  method: 'delete',
  path: '/users/{userId}',
  tags: ['Users'],
  description: 'Delete a user',
  request: {
    params: z.object({
      userId: z
        .string()
        .uuid()
        .openapi({ param: { name: 'userId', in: 'path' }, example: crypto.randomUUID() }),
    }),
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: userSchema,
        },
      },
      description: 'User deleted successfully',
    },
  },
});

export const deleteUserHandler: Handler = async c => {
  const dbClient = c.get('dbClient');
  const userId = c.req.param('userId');
  const deletedUser = await deleteUserData({ dbClient, id: userId });

  if (!deletedUser) throw new NotFoundError('User not found');

  return c.json(deletedUser, { status: 200 });
};
