import { BadRequestError } from '@/utils/errors';
import { describe, expect } from 'vitest';
import { testWithDbClient } from '../__test-utils__/test-with-db-client';
import { createTestAccountsInDB } from './__test-utils__/make-fake-account';
import { getAccountData } from './get-account';

describe('Get Account', () => {
  testWithDbClient('should get an account', async ({ dbClient }) => {
    const [testCreatedAccount] = await createTestAccountsInDB({ dbClient });

    if (!testCreatedAccount) throw new Error('testCreatedAccount is undefined');

    const account = await getAccountData({ dbClient, id: testCreatedAccount.id });

    expect(account?.id).toBe(testCreatedAccount.id);
  });

  testWithDbClient('should get an account by email', async ({ dbClient }) => {
    const [testCreatedAccount] = await createTestAccountsInDB({ dbClient });

    if (!testCreatedAccount) throw new Error('testCreatedAccount is undefined');

    const account = await getAccountData({ dbClient, email: testCreatedAccount.email });
    expect(account?.id).toBe(testCreatedAccount.id);
  });

  testWithDbClient(
    'should throw BadRequestError if id and email are not provided.',
    async ({ dbClient }) => {
      expect(() => getAccountData({ dbClient })).rejects.toThrow(
        new BadRequestError('Either id or email must be provided.')
      );
    }
  );
});
