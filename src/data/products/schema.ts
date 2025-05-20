import type { Product } from '@/db/schema';
import { z } from '@hono/zod-openapi';

export const productSchemaObject = {
  id: z.string().uuid(),
  created_at: z.union([z.coerce.date(), z.string()]).openapi({
    example: new Date().toISOString(),
  }),
  updated_at: z.union([z.coerce.date(), z.string()]).openapi({
    example: new Date().toISOString(),
  }),
  deleted_at: z.union([z.coerce.date(), z.string()]).nullable().openapi({
    example: null,
  }),
  name: z.string().openapi({
    example: 'Product 1',
  }),
  description: z.string().nullable().openapi({
    example: 'Some description',
  }),
  price: z.number().openapi({
    example: 100.0,
  }),
  user_id: z.string().uuid().openapi({
    example: '123e4567-e89b-12d3-a456-426614174000',
  }),
};

export const productSchema = z.object(productSchemaObject) satisfies z.ZodType<Product>;
export const productSchemaOpenApi = productSchema.openapi('Product');
export const productSchemaFields = z.enum(
  Object.keys(productSchemaObject) as [string, ...string[]]
);

export type CreateProduct = Omit<Product, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;
export type UpdateProduct = Partial<Product>;
