import { getUserData } from '@/data/users/get-user';
import { userSchemaOpenApi } from '@/data/users/schema';
import { authenticationMiddleware } from '@/middlewares/authentication';
import { type Session } from '@/types/auth';
import { type AppRouteHandler } from '@/types/hono';
import { createRoute, type z } from '@hono/zod-openapi';

export const getMyProfileSchema = {
  response: userSchemaOpenApi,
};

export type GetMyProfileResponse = z.infer<typeof getMyProfileSchema.response>;

export const getMyProfileRoute = createRoute({
  middleware: [authenticationMiddleware],
  security: [{ bearerAuth: [] }],
  method: 'get',
  path: '/me',
  tags: ['Me'],
  summary: 'Retrieve my profile',
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
});

export const getMyProfileRouteHandler: AppRouteHandler<typeof getMyProfileRoute> = async c => {
  const dbClient = c.get('dbClient');
  const session = c.get('session') as Session;

  const myProfile = await getUserData({ dbClient, id: session.accountId });

  return c.json(myProfile, { status: 200 });
};
