import { type DB, type UserRoleType, type products, type users } from './types';

type OverrideIdAndDates<TTable> = Omit<
  TTable,
  'id' | 'created_at' | 'updated_at' | 'deleted_at'
> & {
  id: string;
  created_at: Date | string;
  updated_at: Date | string;
  deleted_at: Date | string | null;
};

type OverrideUsers = Omit<OverrideIdAndDates<users>, 'role'> & {
  role: UserRoleType;
};

export type Tables = {
  users: OverrideUsers;
  products: OverrideIdAndDates<products>;
};

export type KyselySchema = DB;
