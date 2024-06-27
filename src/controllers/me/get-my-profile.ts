import { getUserData } from '@/data/user/get-user';
import { userOpenApiSchema } from '@/data/user/schema';
import { type Session } from '@/types/auth';
import { createRoute, type z } from '@hono/zod-openapi';
import { type Handler } from 'hono';

export const getMyProfileSchema = {
  response: userOpenApiSchema,
};

export type GetMyProfileResponse = z.infer<typeof getMyProfileSchema.response>;

export const getMyProfileRoute = createRoute({
  security: [{ bearerAuth: [] }], // 👈 This line is required for private route
  method: 'get',
  path: '/me',
  tags: ['Me'],
  description: 'Get my profile',
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

export const getMyProfileHandler: Handler = async c => {
  const dbClient = c.get('dbClient');
  const session = c.get('session') as Session;

  const myProfile = await getUserData({ dbClient, id: session.id });

  return c.json<GetMyProfileResponse>(myProfile, { status: 200 });
};
