import { FEATURE_FLAG_SCOPES, type FeatureFlag } from '@/db/schema';
import { UserRoleType } from '@/db/types';
import { z } from '@hono/zod-openapi';

export const featureFlagSchemaObject = {
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
  role: z.nativeEnum(UserRoleType).openapi({
    example: UserRoleType.USER,
  }),
  json: z.array(z.enum(FEATURE_FLAG_SCOPES)).openapi({
    example: ['users:read:*', 'users:write:*'],
  }),
};

export const featureFlagSchema = z.object(featureFlagSchemaObject) satisfies z.ZodType<FeatureFlag>;
export const featureFlagSchemaOpenApi = featureFlagSchema.openapi('FeatureFlag');
export const featureFlagSchemaFields = z.enum(
  Object.keys(featureFlagSchemaObject) as [string, ...string[]]
);

export type CreateFeatureFlag = Omit<FeatureFlag, 'created_at' | 'updated_at' | 'deleted_at'>;
export type UpdateFeatureFlag = Partial<FeatureFlag>;
