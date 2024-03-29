import { deleteUser } from '@/data/user/delete-user';
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

export const deleteUserRoute = createRoute({
  method: 'delete',
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
      description: 'User deleted successfully',
    },
  },
});

export const deleteUserHandler: Handler = async c => {
  const dbClient = createDbClient();
  const userId = c.req.param('userId');
  const deletedUser = await deleteUser({ dbClient, id: userId });

  await dbClient.destroy();

  if (!deletedUser) throw new NotFoundError('User not found');

  return c.json(deletedUser, { status: 200 });
};
