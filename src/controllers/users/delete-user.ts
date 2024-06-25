import { deleteUserData } from '@/data/user/delete-user';
import { userSchema } from '@/data/user/schema';
import { createRoute, z } from '@hono/zod-openapi';
import { type Handler } from 'hono';

export const deleteUserSchema = {
  params: z.object({
    userId: z
      .string()
      .uuid()
      .openapi({ param: { name: 'userId', in: 'path' }, example: crypto.randomUUID() }),
  }),
  response: userSchema,
};

export type DeleteUserParams = z.infer<typeof deleteUserSchema.params>;
export type DeleteUserResponse = z.infer<typeof deleteUserSchema.response>;

export const deleteUserRoute = createRoute({
  security: [{ bearerAuth: [] }],
  method: 'delete',
  path: '/users/{userId}',
  tags: ['Users'],
  description: 'Delete a user',
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

export const deleteUserHandler: Handler = async c => {
  const dbClient = c.get('dbClient');
  const userId = c.req.param('userId');

  const deletedUser = await deleteUserData({ dbClient, id: userId });

  return c.json<DeleteUserResponse>(deletedUser, { status: 200 });
};
