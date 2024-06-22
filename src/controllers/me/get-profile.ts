import { getUserData } from '@/data/user/get-user';
import { userSchema } from '@/data/user/schema';
import { type AuthenticatedUser } from '@/types/auth';
import { NotFoundError } from '@/utils/errors';
import { createRoute } from '@hono/zod-openapi';
import { type Handler } from 'hono';

export const getProfileRoute = createRoute({
  security: [{ bearerAuth: [] }] /* You need to add this to all of your private routes */,
  method: 'get',
  path: '/me',
  tags: ['Me'],
  description: 'Get user profile',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: userSchema,
        },
      },
      description: 'User profile retrieved successfully',
    },
  },
});

export const getProfileHandler: Handler = async c => {
  const dbClient = c.get('dbClient');
  const authenticatedUser = c.get('authenticatedUser') as AuthenticatedUser;

  /* This will fail since we haven't handle this yet: `src/middlewares/authentication.ts` */
  const currentUser = await getUserData({ dbClient, id: authenticatedUser.id });

  if (!currentUser) throw new NotFoundError('User not found');

  return c.json(currentUser, { status: 200 });
};