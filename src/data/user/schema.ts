import { type User } from '@/db/schema';
import { UserRoleType } from '@/db/types';
import { z } from '@hono/zod-openapi';

export const userSchema = z.object({
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
  first_name: z.string().nullable().openapi({
    example: 'boss',
  }),
  last_name: z.string().nullable().openapi({
    example: 'ROD',
  }),
  role: z.nativeEnum(UserRoleType).openapi({
    example: UserRoleType.USER,
  }),
}) satisfies z.ZodType<User>;

export const userOpenApiSchema = userSchema.openapi('User');

export type CreateUser = Required<Pick<User, 'email' | 'role'>> &
  Partial<Pick<User, 'first_name' | 'last_name'>>;

export type UpdateUser = Partial<Pick<User, 'first_name' | 'last_name' | 'role'>>;
