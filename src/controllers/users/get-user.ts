import { getUserData } from '@/data/users/get-user';
import { userSchemaOpenApi } from '@/data/users/schema';
import type { AppRouteHandler } from '@/types/hono';
import { createRoute, z } from '@hono/zod-openapi';

export const getUserSchema = {
  params: z.object({
    user_id: z
      .string()
      .uuid()
      .openapi({
        param: { name: 'user_id', in: 'path' },
        example: '123e4567-e89b-12d3-a456-426614174000',
      }),
  }),
  response: userSchemaOpenApi,
};

export type GetUserParams = z.infer<typeof getUserSchema.params>;
export type GetUserResponse = z.infer<typeof getUserSchema.response>;

export const getUserRoute = createRoute({
  middleware: [],
  security: [{ bearerAuth: [] }],
  method: 'get',
  path: '/users/{user_id}',
  tags: ['Users'],
  summary: 'Retrieve a user',
  description: 'Retrieve the details of a user.',
  request: {
    params: getUserSchema.params,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getUserSchema.response,
        },
      },
      description: 'User retrieved successfully',
    },
  },
});

export const getUserRouteHandler: AppRouteHandler<typeof getUserRoute> = async c => {
  const dbClient = c.get('dbClient');
  const param = c.req.valid('param');

  const user = await getUserData({ dbClient, id: param.user_id });

  return c.json(user, { status: 200 });
};
