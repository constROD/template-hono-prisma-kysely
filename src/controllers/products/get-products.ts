import { getProductsData, type GetProductsDataArgs } from '@/data/product/get-products';
import { productOpenApiSchema } from '@/data/product/schema';
import { listQuerySchema, paginationSchema } from '@/utils/zod-schemas';
import { createRoute, type OpenAPIHono, z } from '@hono/zod-openapi';

export const getProductsSchema = {
  query: listQuerySchema,
  response: paginationSchema.extend({
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
  middleware: [],
});

export function makeGetProductsRouteHandler(app: OpenAPIHono) {
  return app.openapi(getProductsRoute, async c => {
    const dbClient = c.get('dbClient');
    const query = c.req.valid('query');

    const data = await getProductsData({
      dbClient,
      sortBy: query?.sort_by as GetProductsDataArgs['sortBy'],
      orderBy: query?.order_by,
      limit: query?.limit,
      page: query?.page,
      includeArchived: query?.include_archived === 'true',
    });

    return c.json(data, { status: 200 });
  });
}
