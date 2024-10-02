import { getUsersData, type GetUsersDataArgs } from '@/data/user/get-users';
import { userOpenApiSchema } from '@/data/user/schema';
import { listQuerySchema, paginationSchema } from '@/utils/zod-schemas';
import { createRoute, z } from '@hono/zod-openapi';
import { type Handler } from 'hono';

export const getUsersSchema = {
  query: listQuerySchema,
  response: paginationSchema.extend({
    records: z.array(userOpenApiSchema),
    total_records: z.number(),
  }),
};

export type GetUsersQuery = z.infer<typeof getUsersSchema.query>;
export type GetUsersResponse = z.infer<typeof getUsersSchema.response>;

export const getUsersRoute = createRoute({
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
  middleware: [],
});

export const getUsersHandler: Handler = async c => {
  const dbClient = c.get('dbClient');
  const query = getUsersSchema.query.parse(c.req.query());

  const data = await getUsersData({
    dbClient,
    sortBy: query?.sort_by as GetUsersDataArgs['sortBy'],
    orderBy: query?.order_by,
    limit: query?.limit,
    page: query?.page,
    includeArchived: query?.include_archived,
  });

  return c.json<GetUsersResponse>(data, { status: 200 });
};
