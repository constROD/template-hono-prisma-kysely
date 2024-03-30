import { type Tables } from '@/db/schema';
import { faker } from '@faker-js/faker';
import { z } from '@hono/zod-openapi';

export const productSchema = (
  z.object({
    id: z.string().uuid(),
    name: z.string().openapi({
      example: faker.commerce.productName(),
    }),
    description: z.string().nullable().openapi({
      example: faker.commerce.productDescription(),
    }),
    price: z.number().openapi({
      example: 0,
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
