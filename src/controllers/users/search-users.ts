import { type GetUsersDataArgs } from '@/data/user/get-users';
import { userOpenApiSchema } from '@/data/user/schema';
import { searchUsersData } from '@/data/user/search-users';
import { listQuerySchema, paginationSchema } from '@/utils/zod-schemas';
import { createRoute, type OpenAPIHono, z } from '@hono/zod-openapi';

export const searchUsersSchema = {
  query: listQuerySchema.extend({
    search: z.string().optional(),
  }),
  response: paginationSchema.extend({
    records: z.array(userOpenApiSchema),
    total_records: z.number(),
  }),
};

export type SearchUsersQuery = z.infer<typeof searchUsersSchema.query>;
export type SearchUsersResponse = z.infer<typeof searchUsersSchema.response>;

export const searchUsersRoute = createRoute({
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

export function makeSearchUsersRouteHandler(app: OpenAPIHono) {
  return app.openapi(searchUsersRoute, async c => {
    const dbClient = c.get('dbClient');
    const query = c.req.valid('query');

    const data = await searchUsersData({
      dbClient,
      sortBy: query?.sort_by as GetUsersDataArgs['sortBy'],
      orderBy: query?.order_by,
      limit: query?.limit,
      page: query?.page,
      includeArchived: query?.include_archived,
      filters: { searchText: query?.search },
    });

    return c.json(data, { status: 200 });
  });
}
