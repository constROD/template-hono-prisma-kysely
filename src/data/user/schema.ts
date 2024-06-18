import { type Tables } from '@/db/schema';
import { z } from '@hono/zod-openapi';

export const userSchema = (
  z.object({
    id: z.string().uuid(),
    email: z.string().email().openapi({
      example: 'bossROD@gmail.com',
    }),
    first_name: z.string().nullable().openapi({
      example: 'boss',
    }),
    last_name: z.string().nullable().openapi({
      example: 'ROD',
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
  }) satisfies z.ZodType<Tables['users']>
).openapi('User');

export type User = z.infer<typeof userSchema>;
