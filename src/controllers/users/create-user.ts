import { createUsersData } from '@/data/user/create-users';
import { userSchema } from '@/data/user/schema';
import { NotFoundError } from '@/utils/errors';
import { createRoute, type z } from '@hono/zod-openapi';
import { type Handler } from 'hono';

export const createUserBodySchema = userSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
});

export type CreateUserBody = z.infer<typeof createUserBodySchema>;

export const createUserRoute = createRoute({
  method: 'post',
  path: '/users',
  tags: ['Users'],
  description: 'Create a user',
  request: {
    body: {
      content: {
        'application/json': {
          schema: createUserBodySchema,
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
  const body = await c.req.json<CreateUserBody>();
  const [createdUser] = await createUsersData({ dbClient, values: body });

  if (!createdUser) throw new NotFoundError('User not found');

  return c.json(createdUser, { status: 201 });
};
