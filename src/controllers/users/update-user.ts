import { userOpenApiSchema, userSchema } from '@/data/user/schema';
import { updateUserData } from '@/data/user/update-user';
import { createRoute, z } from '@hono/zod-openapi';
import { type Handler } from 'hono';

export const updateUserSchema = {
  params: z.object({
    user_id: z
      .string()
      .uuid()
      .openapi({ param: { name: 'user_id', in: 'path' }, example: crypto.randomUUID() }),
  }),
  body: userSchema
    .pick({
      first_name: true,
      last_name: true,
      role: true,
    })
    .partial(),
  response: userOpenApiSchema,
};

export type UpdateUserParams = z.infer<typeof updateUserSchema.params>;
export type UpdateUserBody = z.infer<typeof updateUserSchema.body>;
export type UpdateUserResponse = z.infer<typeof updateUserSchema.response>;

export const updateUserRoute = createRoute({
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
  middleware: [],
});

export const updateUserHandler: Handler = async c => {
  const dbClient = c.get('dbClient');
  const param = c.req.param() as UpdateUserParams;
  const body = await c.req.json<UpdateUserBody>();

  const updatedUser = await updateUserData({ dbClient, id: param.user_id, values: body });

  return c.json<UpdateUserResponse>(updatedUser, { status: 200 });
};
