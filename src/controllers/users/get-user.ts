import { getUserData } from '@/data/user/get-user';
import { NotFoundError } from '@/utils/errors';
import { createRoute, z } from '@hono/zod-openapi';
import { type Handler } from 'hono';
import { userSchema } from './schema';

const schema = {
  params: z.object({
    userId: z
      .string()
      .uuid()
      .openapi({ param: { name: 'userId', in: 'path' }, example: crypto.randomUUID() }),
  }),
};

export const getUserRoute = createRoute({
  method: 'get',
  path: '/users/{userId}',
  tags: ['Users'],
  description: 'Get one user',
  request: {
    params: schema.params,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: userSchema,
        },
      },
      description: 'User retrieved successfully',
    },
  },
});

export const getUserHandler: Handler = async c => {
  const dbClient = c.get('dbClient');
  const userId = c.req.param('userId');
  const user = await getUserData({ dbClient, id: userId });

  if (!user) throw new NotFoundError('User not found');

  return c.json(user, { status: 200 });
};
