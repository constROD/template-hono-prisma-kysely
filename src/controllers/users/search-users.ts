import { type GetUsersDataArgs } from '@/data/users/get-users';
import { userSchemaFields, userSchemaOpenApi } from '@/data/users/schema';
import { searchUsersData } from '@/data/users/search-users';
import { authenticationMiddleware } from '@/middlewares/authentication';
import { type AppRouteHandler } from '@/types/hono';
import { listQuerySchema, paginationSchema } from '@/utils/zod-schemas';
import { createRoute, z } from '@hono/zod-openapi';

export const searchUsersSchema = {
  query: listQuerySchema.extend({
    search: z.string().optional(),
    sort_by: userSchemaFields.optional(),
  }),
  response: paginationSchema.extend({
    records: z.array(userSchemaOpenApi),
    total_records: z.number(),
  }),
};

export type SearchUsersQuery = z.infer<typeof searchUsersSchema.query>;
export type SearchUsersResponse = z.infer<typeof searchUsersSchema.response>;

export const searchUsersRoute = createRoute({
  middleware: [authenticationMiddleware],
  security: [{ bearerAuth: [] }],
  method: 'get',
  path: '/users/search',
  tags: ['Users'],
  summary: 'Search users',
  description: 'Search for users.',
  request: {
    query: searchUsersSchema.query,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: searchUsersSchema.response,
        },
      },
      description: 'Users retrieved successfully',
    },
  },
});

export const searchUsersRouteHandler: AppRouteHandler<typeof searchUsersRoute> = async c => {
  const dbClient = c.get('dbClient');
  const query = c.req.valid('query');

  const data = await searchUsersData({
    dbClient,
    sortBy: query?.sort_by as GetUsersDataArgs['sortBy'],
    orderBy: query?.order_by,
    limit: query?.limit,
    page: query?.page,
    includeArchived: query?.include_archived === 'true',
    filters: { searchText: query?.search },
  });

  return c.json(data, { status: 200 });
};
