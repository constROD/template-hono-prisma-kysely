import { getUser } from '@/data/user/get-user';
import { createDbClient } from '@/db/create-db-client';
import { NotFoundError } from '@/utils/errors';
import { faker } from '@faker-js/faker';
import { createRoute, z } from '@hono/zod-openapi';
import { type Handler } from 'hono';
import { userSchema } from './schema';

const schema = {
  params: z.object({
    userId: z
      .string()
      .uuid()
      .openapi({ param: { name: 'userId', in: 'path' }, example: faker.string.uuid() }),
  }),
};

export const getUserRoute = createRoute({
  method: 'get',
  path: '/users/{userId}',
  tags: ['Users'],
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
  const dbClient = createDbClient();
  const userId = c.req.param('userId');
  const user = await getUser({ dbClient, id: userId });

  await dbClient.destroy();

  if (!user) throw new NotFoundError('User not found');

  return c.json(user, { status: 200 });
};
