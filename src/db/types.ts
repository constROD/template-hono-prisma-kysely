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
    products: products;
    users: users;
};
