import { type DbClient } from '@/db/create-db-client';
import { type Account } from '@/db/schema';
import { NotFoundError } from '@/utils/errors';
import { faker } from '@faker-js/faker';
import { describe, expect } from 'vitest';
import { testWithDbClient } from '../__test-utils__/test-with-db-client';
import { createTestAccountsInDB, makeFakeAccount } from './__test-utils__/make-fake-account';
import { updateAccountData } from './update-account';

// Essential test setup pattern for DB tests
const setupTestData = async ({
  dbClient,
  accounts,
}: {
  dbClient: DbClient;
  accounts: Partial<Account>[];
}) => {
  await createTestAccountsInDB({ dbClient, values: accounts });
};

describe('Update Account', () => {
  testWithDbClient('should update an account', async ({ dbClient }) => {
    // Setup test data
    const fakeAccount = makeFakeAccount();
    await setupTestData({ dbClient, accounts: [fakeAccount] });

    // Verify initial state
    const beforeAccounts = await dbClient.selectFrom('accounts').selectAll().execute();
    expect(beforeAccounts.length).toBe(1);
    expect(beforeAccounts[0]?.id).toBe(fakeAccount.id);
    expect(beforeAccounts[0]?.email).toBe(fakeAccount.email);
    expect(beforeAccounts[0]?.updated_at.getTime()).toBe(
      (fakeAccount.updated_at as Date).getTime()
    );

    // Execute the function under test
    const updatedEmail = faker.internet.email();
    const updatedAccount = await updateAccountData({
      dbClient,
      id: fakeAccount.id,
      values: { email: updatedEmail },
    });

    // Assert results
    const afterAccounts = await dbClient.selectFrom('accounts').selectAll().execute();
    expect(afterAccounts.length).toBe(1);
    expect(updatedAccount?.id).toBe(fakeAccount.id);
    expect(updatedAccount?.email).toBe(updatedEmail);
    expect(updatedAccount?.updated_at.getTime()).not.equal(beforeAccounts[0]?.updated_at.getTime());
  });

  testWithDbClient(
    'should throw NotFoundError if account is not existing.',
    async ({ dbClient }) => {
      // Execute and assert
      expect(() =>
        updateAccountData({
          dbClient,
          id: faker.string.uuid(),
          values: { email: faker.internet.email() },
        })
      ).rejects.toThrow(new NotFoundError('Account not found.'));
    }
  );
});
