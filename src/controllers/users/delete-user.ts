import { deleteUserData } from '@/data/users/delete-user';
import { userSchemaOpenApi } from '@/data/users/schema';
import { authenticationMiddleware } from '@/middlewares/authentication';
import { type AppRouteHandler } from '@/types/hono';
import { createRoute, z } from '@hono/zod-openapi';

export const deleteUserSchema = {
  params: z.object({
    user_id: z
      .string()
      .uuid()
      .openapi({ param: { name: 'user_id', in: 'path' }, example: crypto.randomUUID() }),
  }),
  response: userSchemaOpenApi,
};

export type DeleteUserParams = z.infer<typeof deleteUserSchema.params>;
export type DeleteUserResponse = z.infer<typeof deleteUserSchema.response>;

export const deleteUserRoute = createRoute({
  middleware: [authenticationMiddleware],
  security: [{ bearerAuth: [] }],
  method: 'delete',
  path: '/users/{user_id}',
  tags: ['Users'],
  summary: 'Delete a user',
  description: 'Delete a user.',
  request: {
    params: deleteUserSchema.params,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: deleteUserSchema.response,
        },
      },
      description: 'User deleted successfully',
    },
  },
});

export const deleteUserRouteHandler: AppRouteHandler<typeof deleteUserRoute> = async c => {
  const dbClient = c.get('dbClient');
  const param = c.req.valid('param');

  const deletedUser = await deleteUserData({ dbClient, id: param.user_id });

  return c.json(deletedUser, { status: 200 });
};
