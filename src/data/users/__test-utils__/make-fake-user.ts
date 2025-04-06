import { type DbClient } from '@/db/create-db-client';
import { type User } from '@/db/schema';
import { UserRoleType } from '@/db/types';
import { faker } from '@faker-js/faker';

export function makeFakeUser(overrides?: Partial<User>) {
  return {
    id: faker.string.uuid(),
    created_at: faker.date.recent(),
    updated_at: faker.date.recent(),
    deleted_at: null,
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    role: UserRoleType.USER,
    ...overrides,
  } satisfies User;
}

export type CreateTestUsersInDBArgs = {
  dbClient: DbClient;
  values?: Partial<User> | Partial<User>[];
};

export async function createTestUsersInDB({ dbClient, values }: CreateTestUsersInDBArgs) {
  const fakeUsers = Array.isArray(values) ? values.map(makeFakeUser) : makeFakeUser(values);
  const createdUsers = await dbClient
    .insertInto('users')
    .values(fakeUsers)
    .returningAll()
    .execute();
  return createdUsers;
}
