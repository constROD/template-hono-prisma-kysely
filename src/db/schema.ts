import { type DB, type UserRoleType, type products, type users } from './types';

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

export type User = OverrideUsers;
export type Product = OverrideCommonFields<products>;

export type KyselySchema = DB;
