import { type DbClient } from '@/db/create-db-client';
import { type Account } from '@/db/schema';
import { faker } from '@faker-js/faker';

export function makeFakeAccount(overrides?: Partial<Account>) {
  return {
    id: faker.string.uuid(),
    created_at: faker.date.recent(),
    updated_at: faker.date.recent(),
    deleted_at: null,
    email: faker.internet.email().toLowerCase(),
    password: faker.string.uuid(),
    ...overrides,
  } satisfies Account;
}

export type CreateTestAccountsInDBArgs = {
  dbClient: DbClient;
  values?: Partial<Account> | Partial<Account>[];
};

export async function createTestAccountsInDB({ dbClient, values }: CreateTestAccountsInDBArgs) {
  const fakeAccounts = Array.isArray(values)
    ? values.map(makeFakeAccount)
    : makeFakeAccount(values);
  const createdAccounts = await dbClient
    .insertInto('accounts')
    .values(fakeAccounts)
    .returningAll()
    .execute();
  return createdAccounts;
}
