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

export const createUserSchema = userSchema
  .extend({
    email: z.string().email().openapi({
      example: 'bossROD@gmail.com',
    }),
    first_name: z.string().optional().openapi({
      example: 'boss',
    }),
    last_name: z.string().optional().openapi({
      example: 'ROD',
    }),
  })
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
    deleted_at: true,
  });

export const updateUserSchema = userSchema
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
    deleted_at: true,
    email: true,
  })
  .partial();

export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
