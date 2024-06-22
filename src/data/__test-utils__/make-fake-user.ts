import { type DbClient } from '@/db/create-db-client';
import { type User } from '@/db/schema';
import { UserRoleType } from '@/db/types';
import { faker } from '@faker-js/faker';
import { createUsersData } from '../user/create-users';

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

export type CreateTestUserInDBArgs = {
  dbClient: DbClient;
  values?: Partial<User> | Partial<User>[];
};

export async function createTestUsersInDB({ dbClient, values }: CreateTestUserInDBArgs) {
  const fakeUsers = values instanceof Array ? values.map(makeFakeUser) : makeFakeUser();
  const createdUsers = await createUsersData({ dbClient, values: fakeUsers });
  return createdUsers;
}
