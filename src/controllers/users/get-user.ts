import { getUserData } from '@/data/user/get-user';
import { userOpenApiSchema } from '@/data/user/schema';
import { createRoute, z } from '@hono/zod-openapi';
import { type Handler } from 'hono';

export const getUserSchema = {
  params: z.object({
    user_id: z
      .string()
      .uuid()
      .openapi({ param: { name: 'user_id', in: 'path' }, example: crypto.randomUUID() }),
  }),
  response: userOpenApiSchema,
};

export type GetUserParams = z.infer<typeof getUserSchema.params>;
export type GetUserResponse = z.infer<typeof getUserSchema.response>;

export const getUserRoute = createRoute({
  method: 'get',
  path: '/users/{user_id}',
  tags: ['Users'],
  description: 'Get one user',
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

export const getUserHandler: Handler = async c => {
  const dbClient = c.get('dbClient');
  const param = c.req.param() as GetUserParams;

  const user = await getUserData({ dbClient, id: param.user_id });

  return c.json<GetUserResponse>(user, { status: 200 });
};
