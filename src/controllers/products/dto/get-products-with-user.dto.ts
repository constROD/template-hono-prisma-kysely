import { productSchema } from '@/data/products/schema';
import type { SearchProductsDataResponse } from '@/data/products/search-products';
import { userSchema } from '@/data/users/schema';
import type { z } from 'zod';

export const getProductsWithUserDTOSchema = productSchema.omit({ user_id: true }).extend({
  user: userSchema,
});

export type GetProductsWithUserDTO = z.infer<typeof getProductsWithUserDTOSchema>;

export type GetProductsWithUserDTOArgs = SearchProductsDataResponse['records'][number];

export function getProductsWithUserDTO(record: GetProductsWithUserDTOArgs) {
  return {
    id: record.id,
    created_at: record.created_at,
    updated_at: record.updated_at,
    deleted_at: record.deleted_at,
    name: record.name,
    description: record.description,
    price: record.price,
    user: {
      id: record.user_id,
      created_at: record.user_created_at,
      updated_at: record.user_updated_at,
      deleted_at: record.user_deleted_at,
      first_name: record.user_first_name,
      last_name: record.user_last_name,
      email: record.user_email,
      role: record.user_role,
    } as GetProductsWithUserDTO['user'],
  } satisfies GetProductsWithUserDTO;
}
