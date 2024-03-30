import { getUsers } from '@/data/user/get-users';
import { createDbClient } from '@/db/create-db-client';
import { NotFoundError } from '@/utils/errors';
import { createRoute, z } from '@hono/zod-openapi';
import { type Handler } from 'hono';
import { userSchema } from './schema';

export const getUsersRoute = createRoute({
  method: 'get',
  path: '/users',
  tags: ['Users'],
  description: 'List of users',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(userSchema),
        },
      },
      description: 'Users retrieved successfully',
    },
  },
});

export const getUsersHandler: Handler = async c => {
  throw new NotFoundError('User not found');

  const dbClient = createDbClient();
  const users = await getUsers({ dbClient });

  await dbClient.destroy();

  return c.json(users, { status: 200 });
};
