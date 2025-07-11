import { userSchema, userSchemaOpenApi } from '@/data/users/schema';
import { updateUserData } from '@/data/users/update-user';
import type { AppRouteHandler } from '@/types/hono';
import { createRoute, z } from '@hono/zod-openapi';

export const updateUserSchema = {
  params: z.object({
    user_id: z
      .string()
      .uuid()
      .openapi({
        param: { name: 'user_id', in: 'path' },
        example: '123e4567-e89b-12d3-a456-426614174000',
      }),
  }),
  body: userSchema
    .pick({
      first_name: true,
      last_name: true,
      role: true,
    })
    .partial(),
  response: userSchemaOpenApi,
};

export type UpdateUserParams = z.infer<typeof updateUserSchema.params>;
export type UpdateUserBody = z.infer<typeof updateUserSchema.body>;
export type UpdateUserResponse = z.infer<typeof updateUserSchema.response>;

export const updateUserRoute = createRoute({
  middleware: [],
  security: [{ bearerAuth: [] }],
  method: 'put',
  path: '/users/{user_id}',
  tags: ['Users'],
  summary: 'Update a user',
  description: 'Update a user.',
  request: {
    params: updateUserSchema.params,
    body: {
      content: {
        'application/json': {
          schema: updateUserSchema.body,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: updateUserSchema.response,
        },
      },
      description: 'User updated successfully',
    },
  },
});

export const updateUserRouteHandler: AppRouteHandler<typeof updateUserRoute> = async c => {
  const dbClient = c.get('dbClient');
  const param = c.req.valid('param');
  const body = c.req.valid('json');

  const updatedUser = await updateUserData({ dbClient, id: param.user_id, values: body });

  return c.json(updatedUser, { status: 200 });
};
