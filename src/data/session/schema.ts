import { type Session } from '@/db/schema';
import { z } from '@hono/zod-openapi';

export const sessionSchemaObject = {
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
  refresh_token: z.string().openapi({
    example: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
  }),
  account_id: z.string().uuid().openapi({
    example: 'fb123456-7890-1234-5678-901234567890',
  }),
};

export const sessionSchema = z.object(sessionSchemaObject) satisfies z.ZodType<Session>;
export const sessionSchemaOpenApi = sessionSchema.openapi('Session');
export const sessionSchemaFields = z.enum(
  Object.keys(sessionSchemaObject) as [string, ...string[]]
);

export type CreateSession = Omit<Session, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;
export type UpdateSession = Partial<Session>;
