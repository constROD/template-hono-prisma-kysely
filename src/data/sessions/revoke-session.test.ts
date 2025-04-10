import { type DbClient } from '@/db/create-db-client';
import { type Account, type Session } from '@/db/schema';
import { describe, expect } from 'vitest';
import { testWithDbClient } from '../__test-utils__/test-with-db-client';
import {
  createTestAccountsInDB,
  makeFakeAccount,
} from '../accounts/__test-utils__/make-fake-account';
import { createTestSessionsInDB, makeFakeSession } from './__test-utils__/make-fake-session';
import { revokeSessionData } from './revoke-session';

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

describe('Revoke Session', () => {
  testWithDbClient('should revoke a session', async ({ dbClient }) => {
    // Setup test data
    const fakeAccount = makeFakeAccount();
    const fakeSession = makeFakeSession({ account_id: fakeAccount.id });
    await setupTestData({
      dbClient,
      accounts: [fakeAccount],
      sessions: [fakeSession],
    });

    // Verify initial state
    const beforeSessions = await dbClient.selectFrom('sessions').selectAll().execute();
    expect(beforeSessions.length).toBe(1);
    expect(beforeSessions[0]?.id).toBe(fakeSession.id);

    // Execute the function under test
    const revokedSession = await revokeSessionData({ dbClient, accountId: fakeAccount.id });

    // Assert results
    const afterSessions = await dbClient.selectFrom('sessions').selectAll().execute();
    expect(afterSessions.length).toBe(0);
    expect(revokedSession?.id).toBe(fakeSession.id);
  });
});
