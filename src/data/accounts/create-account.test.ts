import { describe, expect } from 'vitest';
import { testWithDbClient } from '../__test-utils__/test-with-db-client';
import { makeFakeAccount } from './__test-utils__/make-fake-account';
import { createAccountData } from './create-account';

describe('Create Account', () => {
  testWithDbClient('should create an account', async ({ dbClient }) => {
    const fakeAccount = makeFakeAccount();

    const createdAccount = await createAccountData({ dbClient, values: fakeAccount });

    expect(createdAccount).toBeDefined();
    expect(createdAccount?.id).toBeDefined();
    expect(createdAccount?.email).toEqual(fakeAccount.email);
    expect(createdAccount?.password).toEqual(fakeAccount.password);
    expect(createdAccount?.created_at).toBeDefined();
    expect(createdAccount?.updated_at).toBeDefined();

    const currentAccounts = await dbClient.selectFrom('accounts').selectAll().execute();

    expect(currentAccounts.length).toBe(1);
  });
});
