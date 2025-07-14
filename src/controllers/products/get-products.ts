import { getProductsData, type GetProductsDataArgs } from '@/data/products/get-products';
import { productSchemaFields, productSchemaOpenApi } from '@/data/products/schema';
import { authenticationMiddleware } from '@/middlewares/authentication';
import type { AppRouteHandler } from '@/types/hono';
import { parseStringBoolean } from '@/utils/query';
import { listQuerySchema, paginationSchema } from '@/utils/zod-schemas';
import { createRoute, z } from '@hono/zod-openapi';

export const getProductsSchema = {
  query: listQuerySchema.extend({
    sort_by: productSchemaFields.optional(),
  }),
  response: paginationSchema.extend({
    records: z.array(productSchemaOpenApi),
    total_records: z.number(),
  }),
};

export type GetProductsQuery = z.infer<typeof getProductsSchema.query>;
export type GetProductsResponse = z.infer<typeof getProductsSchema.response>;

export const getProductsRoute = createRoute({
  middleware: [authenticationMiddleware],
  security: [{ bearerAuth: [] }],
  method: 'get',
  path: '/products',
  tags: ['Products'],
  summary: 'List all products',
  description: 'Retrieve a list of all products.',
  request: {
    query: getProductsSchema.query,
  },
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
});

export const getProductsRouteHandler: AppRouteHandler<typeof getProductsRoute> = async c => {
  const dbClient = c.get('dbClient');
  const query = c.req.valid('query');

  const data = await getProductsData({
    dbClient,
    sortBy: query?.sort_by as GetProductsDataArgs['sortBy'],
    orderBy: query?.order_by,
    limit: query?.limit,
    page: query?.page,
    includeArchived: parseStringBoolean(query?.include_archived),
  });

  return c.json(data, { status: 200 });
};
