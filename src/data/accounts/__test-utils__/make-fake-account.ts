import { type DbClient } from '@/db/create-db-client';
import { type Account } from '@/db/schema';
import { overrideValueOrUseDefault } from '@/utils/guard';
import { faker } from '@faker-js/faker';

export function makeFakeAccount(args?: Partial<Account>) {
  return {
    id: overrideValueOrUseDefault(args?.id, faker.string.uuid()),
    created_at: overrideValueOrUseDefault(args?.created_at, faker.date.recent()),
    updated_at: overrideValueOrUseDefault(args?.updated_at, faker.date.recent()),
    deleted_at: overrideValueOrUseDefault(args?.deleted_at, null),
    email: overrideValueOrUseDefault(args?.email, faker.internet.email().toLowerCase()),
    password: overrideValueOrUseDefault(args?.password, faker.string.uuid()),
  } satisfies Account;
}

export type CreateTestAccountsInDBArgs = {
  dbClient: DbClient;
  values?: Partial<Account> | Partial<Account>[];
};

export async function createTestAccountsInDB({ dbClient, values }: CreateTestAccountsInDBArgs) {
  const fakeAccounts =
    values instanceof Array ? values.map(makeFakeAccount) : makeFakeAccount(values);
  const createdAccounts = await dbClient
    .insertInto('accounts')
    .values(fakeAccounts)
    .returningAll()
    .execute();
  return createdAccounts;
}
