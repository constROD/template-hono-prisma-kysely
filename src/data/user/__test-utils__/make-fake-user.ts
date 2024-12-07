import { type DbClient } from '@/db/create-db-client';
import { type User } from '@/db/schema';
import { UserRoleType } from '@/db/types';
import { faker } from '@faker-js/faker';

export function makeFakeUser(args?: Partial<User>) {
  return {
    id: args?.id ?? faker.string.uuid(),
    created_at: args?.created_at ?? faker.date.recent(),
    updated_at: args?.updated_at ?? faker.date.recent(),
    deleted_at: args?.deleted_at ?? null,
    first_name: args?.first_name ?? faker.person.firstName(),
    last_name: args?.last_name ?? faker.person.lastName(),
    email: args?.email?.toLowerCase() ?? faker.internet.email().toLowerCase(),
    role: args?.role ?? UserRoleType.USER,
  } satisfies User;
}

export type CreateTestUsersInDBArgs = {
  dbClient: DbClient;
  values?: Partial<User> | Partial<User>[];
};

export async function createTestUsersInDB({ dbClient, values }: CreateTestUsersInDBArgs) {
  const fakeUsers = values instanceof Array ? values.map(makeFakeUser) : makeFakeUser(values);
  const createdUsers = await dbClient
    .insertInto('users')
    .values(fakeUsers)
    .returningAll()
    .execute();
  return createdUsers;
}
