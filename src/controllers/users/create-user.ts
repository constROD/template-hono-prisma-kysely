import { createUserData } from '@/data/user/create-user';
import { userSchema } from '@/data/user/schema';
import { NotFoundError } from '@/utils/errors';
import { createRoute, z } from '@hono/zod-openapi';
import { type Handler } from 'hono';

export const createUserSchema = userSchema
  .extend({
    email: z.string().email().openapi({
      example: 'bossROD@gmail.com',
    }),
    first_name: z.string().optional().openapi({
      example: 'boss',
    }),
    last_name: z.string().optional().openapi({
      example: 'ROD',
    }),
  })
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
    deleted_at: true,
  });

export type CreateUser = z.infer<typeof createUserSchema>;

export const createUserRoute = createRoute({
  method: 'post',
  path: '/users',
  tags: ['Users'],
  description: 'Create a user',
  request: {
    body: {
      content: {
        'application/json': {
          schema: createUserSchema,
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
  const body = await c.req.json<CreateUser>();
  const createdUser = await createUserData({ dbClient, values: body });

  if (!createdUser) throw new NotFoundError('User not found');

  return c.json(createdUser, { status: 201 });
};
