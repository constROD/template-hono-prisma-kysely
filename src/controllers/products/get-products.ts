import { getProductsData } from '@/data/product/get-products';
import { createRoute, z } from '@hono/zod-openapi';
import { type Handler } from 'hono';
import { productSchema } from './schema';

export const getProductsRoute = createRoute({
  method: 'get',
  path: '/products',
  tags: ['Products'],
  description: 'List of products',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: z.array(productSchema),
        },
      },
      description: 'Products retrieved successfully',
    },
  },
});

export const getProductsHandler: Handler = async c => {
  const dbClient = c.get('dbClient');
  const products = await getProductsData({ dbClient });

  return c.json(products, { status: 200 });
};
