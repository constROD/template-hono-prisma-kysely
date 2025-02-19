import { NotFoundError } from '@/utils/errors';
import { faker } from '@faker-js/faker';
import { describe, expect } from 'vitest';
import { testWithDbClient } from '../__test-utils__/test-with-db-client';
import { createTestAccountsInDB, makeFakeAccount } from './__test-utils__/make-fake-account';
import { updateAccountData } from './update-account';

describe('Update Account', () => {
  testWithDbClient('should update an account', async ({ dbClient }) => {
    const fakeAccount = makeFakeAccount();

    await createTestAccountsInDB({ dbClient, values: fakeAccount });

    const beforeAccounts = await dbClient.selectFrom('accounts').selectAll().execute();

    expect(beforeAccounts.length).toBe(1);
    expect(beforeAccounts[0]?.id).toBe(fakeAccount.id);
    expect(beforeAccounts[0]?.email).toBe(fakeAccount.email);
    expect(beforeAccounts[0]?.password).toBe(fakeAccount.password);
    expect(beforeAccounts[0]?.created_at.getTime()).toBe(
      (fakeAccount.created_at as Date).getTime()
    );
    expect(beforeAccounts[0]?.updated_at.getTime()).toBe(
      (fakeAccount.updated_at as Date).getTime()
    );

    const updatedEmail = faker.internet.email();
    const updatedAccount = await updateAccountData({
      dbClient,
      id: fakeAccount.id,
      values: { email: updatedEmail },
    });
    const afterAccounts = await dbClient.selectFrom('accounts').selectAll().execute();

    expect(afterAccounts.length).toBe(1);
    expect(updatedAccount?.id).toBe(fakeAccount.id);
    expect(updatedAccount?.email).toBe(updatedEmail);
    expect(updatedAccount?.updated_at.getTime()).not.equal(beforeAccounts[0]?.updated_at.getTime());
  });

  testWithDbClient(
    'should throw NotFoundError if account is not existing.',
    async ({ dbClient }) => {
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
