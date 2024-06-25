import { getUserData } from '@/data/user/get-user';
import { userSchema } from '@/data/user/schema';
import { type AuthenticatedUser } from '@/types/auth';
import { createRoute, type z } from '@hono/zod-openapi';
import { type Handler } from 'hono';

export const getProfileSchema = {
  response: userSchema,
};

export type GetProfileResponse = z.infer<typeof getProfileSchema.response>;

export const getProfileRoute = createRoute({
  security: [{ bearerAuth: [] }],
  method: 'get',
  path: '/me',
  tags: ['Me'],
  description: 'Get user profile',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getProfileSchema.response,
        },
      },
      description: 'User profile retrieved successfully',
    },
  },
});

export const getProfileHandler: Handler = async c => {
  const dbClient = c.get('dbClient');
  const authenticatedUser = c.get('authenticatedUser') as AuthenticatedUser;

  const currentProfile = await getUserData({ dbClient, id: authenticatedUser.id });

  return c.json<GetProfileResponse>(currentProfile, { status: 200 });
};
