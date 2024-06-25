import { getProductsData } from '@/data/product/get-products';
import { productSchema } from '@/data/product/schema';
import { createRoute, z } from '@hono/zod-openapi';
import { type Handler } from 'hono';

export const getProductsSchema = {
  query: z.object({
    limit: z.coerce.number().optional(),
    page: z.coerce.number().optional(),
    sort_by: z.string().optional(),
    order_by: z.enum(['asc', 'desc']).optional(),
  }),
  response: z.object({
    records: z.array(productSchema),
    total_records: z.number(),
  }),
};

export type GetProductsQuery = z.infer<typeof getProductsSchema.query>;
export type GetProductsResponse = z.infer<typeof getProductsSchema.response>;

export const getProductsRoute = createRoute({
  method: 'get',
  path: '/products',
  tags: ['Products'],
  description: 'List of products',
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

export const getProductsHandler: Handler = async c => {
  const dbClient = c.get('dbClient');
  const query = c.req.query() as GetProductsQuery | undefined;

  const data = await getProductsData({ dbClient, ...query });

  return c.json<GetProductsResponse>(
    {
      records: data.records,
      total_records: data.totalRecords,
    },
    { status: 200 }
  );
};
