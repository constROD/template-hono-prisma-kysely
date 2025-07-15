import type { Account } from '@/db/schema';
import { z } from '@hono/zod-openapi';

export const accountSchemaObject = {
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
  email: z.string().email().openapi({
    example: 'bossROD@gmail.com',
  }),
  password: z.string().openapi({
    example: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
  }),
  reset_code: z.string().length(6).nullable().openapi({
    example: 'ABC123',
  }),
  reset_code_expires: z
    .union([z.coerce.date(), z.string()])
    .nullable()
    .openapi({
      example: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    }),
  reset_attempts: z.number().int().min(0).openapi({
    example: 0,
  }),
  reset_blocked_until: z.union([z.coerce.date(), z.string()]).nullable().openapi({
    example: null,
  }),
};

export const accountSchema = z.object(accountSchemaObject) satisfies z.ZodType<Account>;
export const accountSchemaOpenApi = accountSchema.openapi('Account');
export const accountSchemaFields = z.enum(
  Object.keys(accountSchemaObject) as [string, ...string[]]
);

export type CreateAccount = Omit<Account, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;
export type UpdateAccount = Partial<Account>;
