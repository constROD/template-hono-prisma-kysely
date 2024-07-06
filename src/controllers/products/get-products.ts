import { getProductsData, type GetProductsDataArgs } from '@/data/product/get-products';
import { productOpenApiSchema } from '@/data/product/schema';
import { getAuthenticatedUserMiddleware } from '@/middlewares/get-authenticated-user';
import { createRoute, z } from '@hono/zod-openapi';
import { type Handler } from 'hono';

export const getProductsSchema = {
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
    records: z.array(productOpenApiSchema),
    total_records: z.number(),
  }),
};

export type GetProductsQuery = z.infer<typeof getProductsSchema.query>;
export type GetProductsResponse = z.infer<typeof getProductsSchema.response>;

export const getProductsRoute = createRoute({
  method: 'get',
  path: '/products',
  tags: ['Products'],
  summary: 'List all products',
  description: 'Retrieve a list of all products.',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getProductsSchema.response,
        },
      },
      description: 'Products retrieved successfully',
    },
  },
  middleware: [getAuthenticatedUserMiddleware], // This middleware is used to get the authenticated user from the session
});

export const getProductsHandler: Handler = async c => {
  const dbClient = c.get('dbClient');
  const query = getProductsSchema.query.parse(c.req.query());

  const data = await getProductsData({
    dbClient,
    sortBy: query?.sort_by as GetProductsDataArgs['sortBy'],
    orderBy: query?.order_by,
    limit: query?.limit,
    page: query?.page,
    includeArchived: query?.include_archived,
  });

  return c.json<GetProductsResponse>(
    {
      records: data.records,
      total_records: data.totalRecords,
    },
    { status: 200 }
  );
};
