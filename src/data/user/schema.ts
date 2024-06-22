import { type Tables } from '@/db/schema';
import { UserRoleType } from '@/db/types';
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
    created_at: z.union([z.coerce.date(), z.string()]).openapi({
      example: new Date().toISOString(),
    }),
    role: z.nativeEnum(UserRoleType).openapi({
      example: UserRoleType.USER,
    }),
    updated_at: z.union([z.coerce.date(), z.string()]).openapi({
      example: new Date().toISOString(),
    }),
    deleted_at: z.union([z.coerce.date(), z.string()]).nullable().openapi({
      example: null,
    }),
  }) satisfies z.ZodType<Tables['users']>
).openapi('User');

export type User = z.infer<typeof userSchema>;
