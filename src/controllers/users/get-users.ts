import { getUsersData, type GetUsersDataArgs } from '@/data/user/get-users';
import { userOpenApiSchema } from '@/data/user/schema';
import { createRoute, z } from '@hono/zod-openapi';
import { type Handler } from 'hono';

export const getUsersSchema = {
  query: z.object({
    limit: z.coerce.number().optional(),
    page: z.coerce.number().optional(),
    sort_by: z.string().optional(),
    order_by: z.enum(['asc', 'desc']).optional(),
    include_archived: z
      .enum(['true', 'false'])
      .transform(v => v === 'true')
      .optional(),
  }),
  response: z.object({
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
  description: 'List of users',
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

  return c.json<GetUsersResponse>(
    {
      records: data.records,
      total_records: data.totalRecords,
    },
    { status: 200 }
  );
};
