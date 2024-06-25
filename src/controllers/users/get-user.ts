import { getUserData } from '@/data/user/get-user';
import { userSchema } from '@/data/user/schema';
import { NotFoundError } from '@/utils/errors';
import { createRoute, z } from '@hono/zod-openapi';
import { type Handler } from 'hono';

export const getUserSchema = {
  params: z.object({
    userId: z
      .string()
      .uuid()
      .openapi({ param: { name: 'userId', in: 'path' }, example: crypto.randomUUID() }),
  }),
  response: userSchema,
};

export type GetUserParams = z.infer<typeof getUserSchema.params>;
export type GetUserResponse = z.infer<typeof getUserSchema.response>;

export const getUserRoute = createRoute({
  security: [{ bearerAuth: [] }],
  method: 'get',
  path: '/users/{userId}',
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
  const userId = c.req.param('userId');

  const user = await getUserData({ dbClient, id: userId });

  if (!user) throw new NotFoundError('User not found');

  return c.json<GetUserResponse>(user, { status: 200 });
};
