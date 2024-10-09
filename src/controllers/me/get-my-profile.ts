import { getUserData } from '@/data/user/get-user';
import { userOpenApiSchema } from '@/data/user/schema';
import { type Session } from '@/types/auth';
import { createRoute, type OpenAPIHono, type z } from '@hono/zod-openapi';

export const getMyProfileSchema = {
  response: userOpenApiSchema,
};

export type GetMyProfileResponse = z.infer<typeof getMyProfileSchema.response>;

export const getMyProfileRoute = createRoute({
  security: [{ bearerAuth: [] }], // 👈 This line is required for private route
  method: 'get',
  path: '/me',
  tags: ['Me'],
  summary: 'Retrieve a profile',
  description: 'Retrieve your profile.',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getMyProfileSchema.response,
        },
      },
      description: 'My profile retrieved successfully',
    },
  },
  middleware: [],
});

export function makeGetMyProfileRouteHandler(app: OpenAPIHono) {
  return app.openapi(getMyProfileRoute, async c => {
    const dbClient = c.get('dbClient');
    const session = c.get('session') as Session;

    const myProfile = await getUserData({ dbClient, id: session.id });

    return c.json(myProfile, { status: 200 });
  });
}
