import { type Tables } from '@/db/schema';
import { z } from '@hono/zod-openapi';

export const productSchema = (
  z.object({
    id: z.string().uuid(),
    name: z.string().openapi({
      example: 'Product 1',
    }),
    description: z.string().nullable().openapi({
      example: 'Some description',
    }),
    price: z.number().openapi({
      example: 100.0,
    }),
    created_at: z.date().openapi({
      example: new Date().toISOString(),
    }),
    updated_at: z.date().openapi({
      example: new Date().toISOString(),
    }),
    deleted_at: z.date().nullable().openapi({
      example: null,
    }),
  }) satisfies z.ZodType<Tables['products']>
).openapi('Product');

export type Product = z.infer<typeof productSchema>;
