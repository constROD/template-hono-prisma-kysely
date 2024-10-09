import { deleteUserData } from '@/data/user/delete-user';
import { userOpenApiSchema } from '@/data/user/schema';
import { createRoute, type OpenAPIHono, z } from '@hono/zod-openapi';

export const deleteUserSchema = {
  params: z.object({
    user_id: z
      .string()
      .uuid()
      .openapi({ param: { name: 'user_id', in: 'path' }, example: crypto.randomUUID() }),
  }),
  response: userOpenApiSchema,
};

export type DeleteUserParams = z.infer<typeof deleteUserSchema.params>;
export type DeleteUserResponse = z.infer<typeof deleteUserSchema.response>;

export const deleteUserRoute = createRoute({
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
  middleware: [],
});

export function makeDeleteUserRouteHandler(app: OpenAPIHono) {
  return app.openapi(deleteUserRoute, async c => {
    const dbClient = c.get('dbClient');
    const param = c.req.valid('param');

    const deletedUser = await deleteUserData({ dbClient, id: param.user_id });

    return c.json(deletedUser, { status: 200 });
  });
}
