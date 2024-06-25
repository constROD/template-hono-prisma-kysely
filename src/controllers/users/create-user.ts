import { createUsersData } from '@/data/user/create-users';
import { userSchema } from '@/data/user/schema';
import { NotFoundError } from '@/utils/errors';
import { createRoute, type z } from '@hono/zod-openapi';
import { type Handler } from 'hono';

export const createUserSchema = {
  body: userSchema.omit({
    id: true,
    created_at: true,
    updated_at: true,
    deleted_at: true,
  }),
  response: userSchema,
};

export type CreateUserBody = z.infer<typeof createUserSchema.body>;
export type CreateUserResponse = z.infer<typeof createUserSchema.response>;

export const createUserRoute = createRoute({
  method: 'post',
  path: '/users',
  tags: ['Users'],
  description: 'Create a user',
  request: {
    body: {
      content: {
        'application/json': {
          schema: createUserSchema.body,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: createUserSchema.response,
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

  return c.json<CreateUserResponse>(createdUser, { status: 201 });
};
