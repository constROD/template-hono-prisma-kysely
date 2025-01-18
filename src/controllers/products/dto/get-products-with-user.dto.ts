import { productSchema } from '@/data/product/schema';
import { type searchProductsData } from '@/data/product/search-products';
import { userSchema } from '@/data/user/schema';
import { type z } from 'zod';

export const getProductsWithUserDTOSchema = productSchema.omit({ user_id: true }).extend({
  user: userSchema,
});

export type GetProductsWithUserDTO = z.infer<typeof getProductsWithUserDTOSchema>;

export function getProductsWithUserDTO(
  records: Awaited<ReturnType<typeof searchProductsData>>['records']
) {
  return records.map(product => ({
    id: product.id,
    created_at: product.created_at,
    updated_at: product.updated_at,
    deleted_at: product.deleted_at,
    name: product.name,
    description: product.description,
    price: product.price,
    user: {
      id: product.user_id,
      created_at: product.user_created_at,
      updated_at: product.user_updated_at,
      deleted_at: product.user_deleted_at,
      first_name: product.user_first_name,
      last_name: product.user_last_name,
      email: product.user_email,
      role: product.user_role,
    } as GetProductsWithUserDTO['user'],
  })) satisfies GetProductsWithUserDTO[];
}
