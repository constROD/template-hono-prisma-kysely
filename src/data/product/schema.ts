import { type Tables } from '@/db/schema';
import { z } from '@hono/zod-openapi';

export const productSchema = (
  z.object({
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
  }) satisfies z.ZodType<Tables['products']>
).openapi('Product');

export type Product = z.infer<typeof productSchema>;
