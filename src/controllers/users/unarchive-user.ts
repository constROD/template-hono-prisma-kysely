import { userSchemaOpenApi } from '@/data/users/schema';
import { updateUserData } from '@/data/users/update-user';
import { type AppRouteHandler } from '@/types/hono';
import { createRoute, z } from '@hono/zod-openapi';

export const unarchiveUserSchema = {
  params: z.object({
    user_id: z
      .string()
      .uuid()
      .openapi({ param: { name: 'user_id', in: 'path' }, example: crypto.randomUUID() }),
  }),
  response: userSchemaOpenApi,
};

export type UnarchiveUserParams = z.infer<typeof unarchiveUserSchema.params>;
export type UnarchiveUserResponse = z.infer<typeof unarchiveUserSchema.response>;

export const unarchiveUserRoute = createRoute({
  middleware: [],
  security: [{ bearerAuth: [] }],
  method: 'put',
  path: '/users/{user_id}/unarchive',
  tags: ['Users'],
  summary: 'Unarchive a user',
  description: 'Unarchive a user.',
  request: {
    params: unarchiveUserSchema.params,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: unarchiveUserSchema.response,
        },
      },
      description: 'User unarchived successfully',
    },
  },
});

export const unarchiveUserRouteHandler: AppRouteHandler<typeof unarchiveUserRoute> = async c => {
  const dbClient = c.get('dbClient');
  const param = c.req.valid('param');

  const unarchivedUser = await updateUserData({
    dbClient,
    id: param.user_id,
    values: { deleted_at: null },
  });

  return c.json(unarchivedUser, { status: 200 });
};
