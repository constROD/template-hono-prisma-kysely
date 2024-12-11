import { type DbClient } from '@/db/create-db-client';
import { type User } from '@/db/schema';
import { UserRoleType } from '@/db/types';
import { overrideValueOrUseDefault } from '@/utils/guard';
import { faker } from '@faker-js/faker';

export function makeFakeUser(args?: Partial<User>) {
  return {
    id: overrideValueOrUseDefault(args?.id, faker.string.uuid()),
    created_at: overrideValueOrUseDefault(args?.created_at, faker.date.recent()),
    updated_at: overrideValueOrUseDefault(args?.updated_at, faker.date.recent()),
    deleted_at: overrideValueOrUseDefault(args?.deleted_at, null),
    first_name: overrideValueOrUseDefault(args?.first_name, faker.person.firstName()),
    last_name: overrideValueOrUseDefault(args?.last_name, faker.person.lastName()),
    email: overrideValueOrUseDefault(args?.email, faker.internet.email().toLowerCase()),
    role: overrideValueOrUseDefault(args?.role, UserRoleType.USER),
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
