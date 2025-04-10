import { type DbClient } from '@/db/create-db-client';
import { type Account, type Session } from '@/db/schema';
import { NotFoundError } from '@/utils/errors';
import { faker } from '@faker-js/faker';
import { describe, expect } from 'vitest';
import { testWithDbClient } from '../__test-utils__/test-with-db-client';
import {
  createTestAccountsInDB,
  makeFakeAccount,
} from '../accounts/__test-utils__/make-fake-account';
import { createTestSessionsInDB, makeFakeSession } from './__test-utils__/make-fake-session';
import { getSessionData } from './get-session';

// Essential test setup pattern for DB tests
const setupTestData = async ({
  dbClient,
  accounts,
  sessions,
}: {
  dbClient: DbClient;
  accounts: Partial<Account>[];
  sessions: Partial<Session>[];
}) => {
  await createTestAccountsInDB({ dbClient, values: accounts });
  await createTestSessionsInDB({ dbClient, values: sessions });
};

describe('Get Session', () => {
  testWithDbClient('should get a session', async ({ dbClient }) => {
    // Setup test data
    const fakeAccount = makeFakeAccount();
    const fakeSession = makeFakeSession({ account_id: fakeAccount.id });
    await setupTestData({
      dbClient,
      accounts: [fakeAccount],
      sessions: [fakeSession],
    });

    // Execute the function under test
    const session = await getSessionData({ dbClient, id: fakeSession.id });

    // Assert results
    expect(session?.id).toBe(fakeSession.id);
    expect(session?.account_id).toBe(fakeSession.account_id);
  });

  testWithDbClient(
    'should throw NotFoundError if session is not existing.',
    async ({ dbClient }) => {
      // Execute and assert
      expect(() =>
        getSessionData({
          dbClient,
          id: faker.string.uuid(),
        })
      ).rejects.toThrow(new NotFoundError('Session not found.'));
    }
  );
});
