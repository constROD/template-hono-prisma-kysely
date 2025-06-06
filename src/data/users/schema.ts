import type { User } from '@/db/schema';
import { UserRoleType } from '@/db/types';
import { emailSchema } from '@/utils/zod-schemas';
import { z } from '@hono/zod-openapi';

export const userSchemaObject = {
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
  email: emailSchema.openapi({
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
};

export const userSchema = z.object(userSchemaObject) satisfies z.ZodType<User>;
export const userSchemaOpenApi = userSchema.openapi('User');
export const userSchemaFields = z.enum(Object.keys(userSchemaObject) as [string, ...string[]]);

export type CreateUser = Omit<User, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;
export type UpdateUser = Partial<User>;
