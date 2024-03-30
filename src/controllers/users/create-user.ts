import { createUser } from '@/data/user/create-user';
import { NotFoundError } from '@/utils/errors';
import { createRoute } from '@hono/zod-openapi';
import { type Handler } from 'hono';
import { createUserSchema, userSchema, type CreateUser } from './schema';

const schema = {
  body: createUserSchema,
};

export const createUserRoute = createRoute({
  method: 'post',
  path: '/users',
  tags: ['Users'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: schema.body,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: userSchema,
        },
      },
      description: 'User created successfully',
    },
  },
});

export const createUserHandler: Handler = async c => {
  const dbClient = c.get('dbClient');
  const body = (await c.req.json()) as CreateUser;
  const createdUser = await createUser({ dbClient, values: body });

  if (!createdUser) throw new NotFoundError('User not found');

  return c.json(createdUser, { status: 201 });
};
