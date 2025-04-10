import { type DbClient } from '@/db/create-db-client';
import { type Account } from '@/db/schema';
import { BadRequestError } from '@/utils/errors';
import { describe, expect } from 'vitest';
import { testWithDbClient } from '../__test-utils__/test-with-db-client';
import { createTestAccountsInDB, makeFakeAccount } from './__test-utils__/make-fake-account';
import { getAccountData } from './get-account';

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

describe('Get Account', () => {
  testWithDbClient('should get an account', async ({ dbClient }) => {
    // Setup test data
    const testAccount = makeFakeAccount();
    await setupTestData({ dbClient, accounts: [testAccount] });

    // Execute the function under test
    const account = await getAccountData({ dbClient, id: testAccount.id });

    // Assert results
    expect(account?.id).toBe(testAccount.id);
  });

  testWithDbClient('should get an account by email', async ({ dbClient }) => {
    // Setup test data
    const testAccount = makeFakeAccount();
    await setupTestData({ dbClient, accounts: [testAccount] });

    // Execute the function under test
    const account = await getAccountData({ dbClient, email: testAccount.email });

    // Assert results
    expect(account?.id).toBe(testAccount.id);
  });

  testWithDbClient(
    'should throw BadRequestError if id and email are not provided.',
    async ({ dbClient }) => {
      // Execute and assert
      expect(() => getAccountData({ dbClient })).rejects.toThrow(
        new BadRequestError('Either id or email must be provided.')
      );
    }
  );
});
