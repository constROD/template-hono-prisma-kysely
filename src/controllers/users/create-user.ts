import { createUsersData } from '@/data/user/create-users';
import { userOpenApiSchema, userSchema } from '@/data/user/schema';
import { NotFoundError } from '@/utils/errors';
import { createRoute, type z } from '@hono/zod-openapi';
import { type Handler } from 'hono';

export const createUserSchema = {
  body: userSchema.pick({
    email: true,
    role: true,
    first_name: true,
    last_name: true,
  }),
  response: userOpenApiSchema,
};

export type CreateUserBody = z.infer<typeof createUserSchema.body>;
export type CreateUserResponse = z.infer<typeof createUserSchema.response>;

export const createUserRoute = createRoute({
  method: 'post',
  path: '/users',
  tags: ['Users'],
  summary: 'Create a user',
  description: 'Create a new user.',
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

  if (!createdUser) throw new NotFoundError('No user created. Please try again.');

  return c.json<CreateUserResponse>(createdUser, { status: 201 });
};
