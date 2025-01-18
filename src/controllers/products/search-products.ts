import { productSchemaFields } from '@/data/product/schema';
import { searchProductsData, type SearchProductsDataArgs } from '@/data/product/search-products';
import { userSchemaFields } from '@/data/user/schema';
import { type AppRouteHandler } from '@/types/hono';
import { listQuerySchema, paginationSchema } from '@/utils/zod-schemas';
import { createRoute, z } from '@hono/zod-openapi';
import {
  getProductsWithUserDTO,
  getProductsWithUserDTOSchema,
} from './dto/get-products-with-user.dto';

export const searchProductsSchema = {
  query: listQuerySchema.extend({
    sort_by: productSchemaFields.optional(),
    sort_by_user_field: userSchemaFields.optional(),
    search: z.string().optional(),
    user_id: z.string().optional(),
  }),
  response: paginationSchema.extend({
    records: z.array(getProductsWithUserDTOSchema),
    total_records: z.number(),
  }),
};

export type SearchProductsQuery = z.infer<typeof searchProductsSchema.query>;
export type SearchProductsResponse = z.infer<typeof searchProductsSchema.response>;

export const searchProductsRoute = createRoute({
  middleware: [],
  security: [{ bearerAuth: [] }],
  method: 'get',
  path: '/products/search',
  tags: ['Products'],
  summary: 'Search products',
  description: 'Search for products.',
  request: {
    query: searchProductsSchema.query,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: searchProductsSchema.response,
        },
      },
      description: 'Products retrieved successfully',
    },
  },
});

export const searchProductsRouteHandler: AppRouteHandler<typeof searchProductsRoute> = async c => {
  const dbClient = c.get('dbClient');
  const query = c.req.valid('query');

  const data = await searchProductsData({
    dbClient,
    sortBy: query?.sort_by as SearchProductsDataArgs['sortBy'],
    sortByUserField: query?.sort_by_user_field as SearchProductsDataArgs['sortByUserField'],
    orderBy: query?.order_by,
    limit: query?.limit,
    page: query?.page,
    includeArchived: query?.include_archived === 'true',
    filters: { searchText: query?.search, userId: query?.user_id },
  });

  const response = {
    ...data,
    records: getProductsWithUserDTO(data.records),
  };

  return c.json(response, { status: 200 });
};
