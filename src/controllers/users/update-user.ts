import { userSchema } from '@/data/user/schema';
import { updateUserData } from '@/data/user/update-user';
import { createRoute, z } from '@hono/zod-openapi';
import { type Handler } from 'hono';

export const updateUserSchema = {
  params: z.object({
    userId: z
      .string()
      .uuid()
      .openapi({ param: { name: 'userId', in: 'path' }, example: crypto.randomUUID() }),
  }),
  body: userSchema
    .omit({
      id: true,
      created_at: true,
      updated_at: true,
      deleted_at: true,
      email: true,
    })
    .partial(),
  response: userSchema,
};

export type UpdateUserParams = z.infer<typeof updateUserSchema.params>;
export type UpdateUserBody = z.infer<typeof updateUserSchema.body>;
export type UpdateUserResponse = z.infer<typeof updateUserSchema.response>;

export const updateUserRoute = createRoute({
  method: 'put',
  path: '/users/{userId}',
  tags: ['Users'],
  description: 'Update a user',
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

export const updateUserHandler: Handler = async c => {
  const dbClient = c.get('dbClient');
  const { userId } = c.req.param() as UpdateUserParams;
  const body = await c.req.json<UpdateUserBody>();

  const updatedUser = await updateUserData({ dbClient, id: userId, values: body });

  return c.json<UpdateUserResponse>(updatedUser, { status: 200 });
};
