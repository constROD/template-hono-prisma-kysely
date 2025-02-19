import { createUserData } from '@/data/users/create-user';
import { userSchema, userSchemaOpenApi } from '@/data/users/schema';
import { authenticationMiddleware } from '@/middlewares/authentication';
import { type AppRouteHandler } from '@/types/hono';
import { NotFoundError } from '@/utils/errors';
import { createRoute, type z } from '@hono/zod-openapi';

export const createUserSchema = {
  body: userSchema.pick({
    email: true,
    role: true,
    first_name: true,
    last_name: true,
  }),
  response: userSchemaOpenApi,
};

export type CreateUserBody = z.infer<typeof createUserSchema.body>;
export type CreateUserResponse = z.infer<typeof createUserSchema.response>;

export const createUserRoute = createRoute({
  middleware: [authenticationMiddleware],
  security: [{ bearerAuth: [] }],
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

export const createUserRouteHandler: AppRouteHandler<typeof createUserRoute> = async c => {
  const dbClient = c.get('dbClient');
  const body = c.req.valid('json');

  const createdUser = await createUserData({ dbClient, values: body });

  if (!createdUser) throw new NotFoundError('No user created. Please try again.');

  return c.json(createdUser, { status: 201 });
};
