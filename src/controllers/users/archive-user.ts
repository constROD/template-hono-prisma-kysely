import { archiveUserData } from '@/data/user/archive-user';
import { userSchema } from '@/data/user/schema';
import { createRoute, z } from '@hono/zod-openapi';
import { type Handler } from 'hono';

export const archiveUserSchema = {
  params: z.object({
    userId: z
      .string()
      .uuid()
      .openapi({ param: { name: 'userId', in: 'path' }, example: crypto.randomUUID() }),
  }),
  response: userSchema,
};

export type ArchiveUserParams = z.infer<typeof archiveUserSchema.params>;
export type ArchiveUserResponse = z.infer<typeof archiveUserSchema.response>;

export const archiveUserRoute = createRoute({
  security: [{ bearerAuth: [] }],
  method: 'put',
  path: '/users/{userId}/archive',
  tags: ['Users'],
  description: 'Archive a user',
  request: {
    params: archiveUserSchema.params,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: archiveUserSchema.response,
        },
      },
      description: 'User archived successfully',
    },
  },
});

export const archiveUserHandler: Handler = async c => {
  const dbClient = c.get('dbClient');
  const { userId } = c.req.param() as ArchiveUserParams;

  const archivedUser = await archiveUserData({ dbClient, id: userId });

  return c.json<ArchiveUserResponse>(archivedUser, { status: 200 });
};
