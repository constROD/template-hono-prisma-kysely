import { getUsersData, type GetUsersDataArgs } from '@/data/users/get-users';
import { userSchemaFields, userSchemaOpenApi } from '@/data/users/schema';
import { authenticationMiddleware } from '@/middlewares/authentication';
import { type AppRouteHandler } from '@/types/hono';
import { listQuerySchema, paginationSchema } from '@/utils/zod-schemas';
import { createRoute, z } from '@hono/zod-openapi';

export const getUsersSchema = {
  query: listQuerySchema.extend({
    sort_by: userSchemaFields.optional(),
  }),
  response: paginationSchema.extend({
    records: z.array(userSchemaOpenApi),
    total_records: z.number(),
  }),
};

export type GetUsersQuery = z.infer<typeof getUsersSchema.query>;
export type GetUsersResponse = z.infer<typeof getUsersSchema.response>;

export const getUsersRoute = createRoute({
  middleware: [authenticationMiddleware],
  security: [{ bearerAuth: [] }],
  method: 'get',
  path: '/users',
  tags: ['Users'],
  summary: 'List all users',
  description: 'Retrieve a list of all users.',
  request: {
    query: getUsersSchema.query,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getUsersSchema.response,
        },
      },
      description: 'Users retrieved successfully',
    },
  },
});

export const getUsersRouteHandler: AppRouteHandler<typeof getUsersRoute> = async c => {
  const dbClient = c.get('dbClient');
  const query = c.req.valid('query');

  const data = await getUsersData({
    dbClient,
    sortBy: query?.sort_by as GetUsersDataArgs['sortBy'],
    orderBy: query?.order_by,
    limit: query?.limit,
    page: query?.page,
    includeArchived: query?.include_archived === 'true',
  });

  return c.json(data, { status: 200 });
};
