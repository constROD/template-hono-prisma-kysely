import {
  type accounts,
  type DB,
  type feature_flags,
  type products,
  type sessions,
  type UserRoleType,
  type users,
} from './types';

/**
 * Utility type to override specific field types from database tables:
 * - DATE fields: converted to `Date | string` if not null else do `Date | string | null`
 * - JSON fields: specific type overrides
 * - DEFAULT fields: explicit type definition
 * @example
 * type SampleTable = {
 *   id: Generated<string>;
 *   name: string;
 *   created_at: Generated<Timestamp>;
 *   updated_at: Generated<Timestamp>;
 *   deleted_at: Timestamp | null;
 *   status: Generated<UserStatusType>;
 * };
 *
 * type OverrideSampleTable = Omit<OverrideCommonFields<SampleTable>, 'status'> & {
 *   status: UserStatusType;
 * };
 */
type OverrideCommonFields<TTable> = Omit<
  TTable,
  'id' | 'created_at' | 'updated_at' | 'deleted_at'
> & {
  id: string;
  created_at: Date | string;
  updated_at: Date | string;
  deleted_at: Date | string | null;
};

type OverrideUsers = Omit<OverrideCommonFields<users>, 'role'> & {
  role: UserRoleType;
};

export const FEATURE_FLAG_SCOPES = [
  'users:read:*',
  'users:write:*',
  'users:write:create',
  'users:write:update',
  'users:write:delete',
  'users:write:archive',
  'users:write:restore',

  'products:read:*',
] as const;

export type FeatureFlagScope = (typeof FEATURE_FLAG_SCOPES)[number];

export type OverrideFeatureFlags = Omit<OverrideCommonFields<feature_flags>, 'json'> & {
  json: Array<FeatureFlagScope>;
};

export type User = OverrideUsers;
export type Account = OverrideCommonFields<accounts>;
export type Session = OverrideCommonFields<sessions>;
export type FeatureFlag = OverrideFeatureFlags;
export type Product = OverrideCommonFields<products>;

export type KyselySchema = DB;
