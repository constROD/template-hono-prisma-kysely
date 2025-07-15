import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const UserRoleType = {
    SUPER_ADMIN: "SUPER_ADMIN",
    ADMIN: "ADMIN",
    USER: "USER"
} as const;
export type UserRoleType = (typeof UserRoleType)[keyof typeof UserRoleType];
export type accounts = {
    id: Generated<string>;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    deleted_at: Timestamp | null;
    email: string;
    password: string;
    reset_code: string | null;
    reset_code_expires: Timestamp | null;
    reset_attempts: Generated<number>;
    reset_blocked_until: Timestamp | null;
};
export type feature_flags = {
    id: Generated<string>;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    deleted_at: Timestamp | null;
    role: UserRoleType;
    json: unknown;
};
export type products = {
    id: Generated<string>;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    deleted_at: Timestamp | null;
    name: string;
    description: string | null;
    price: number;
    user_id: string;
};
export type sessions = {
    id: Generated<string>;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    deleted_at: Timestamp | null;
    refresh_token: string;
    account_id: string;
};
export type users = {
    id: Generated<string>;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    deleted_at: Timestamp | null;
    first_name: string | null;
    last_name: string | null;
    email: string;
    role: Generated<UserRoleType>;
};
export type DB = {
    accounts: accounts;
    feature_flags: feature_flags;
    products: products;
    sessions: sessions;
    users: users;
};
