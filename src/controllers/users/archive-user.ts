import { archiveUserData } from '@/data/user/archive-user';
import { userOpenApiSchema } from '@/data/user/schema';
import { createRoute, type OpenAPIHono, z } from '@hono/zod-openapi';

export const archiveUserSchema = {
  params: z.object({
    user_id: z
      .string()
      .uuid()
      .openapi({ param: { name: 'user_id', in: 'path' }, example: crypto.randomUUID() }),
  }),
  response: userOpenApiSchema,
};

export type ArchiveUserParams = z.infer<typeof archiveUserSchema.params>;
export type ArchiveUserResponse = z.infer<typeof archiveUserSchema.response>;

export const archiveUserRoute = createRoute({
  method: 'delete',
  path: '/users/{user_id}/archive',
  tags: ['Users'],
  summary: 'Archive a user',
  description: 'Archive a user.',
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
  middleware: [],
});

export function makeArchiveUserRouteHandler(app: OpenAPIHono) {
  return app.openapi(archiveUserRoute, async c => {
    const dbClient = c.get('dbClient');
    const param = c.req.valid('param');

    const archivedUser = await archiveUserData({ dbClient, id: param.user_id });

    return c.json(archivedUser, { status: 200 });
  });
}
