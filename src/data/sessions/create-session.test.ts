import { type DbClient } from '@/db/create-db-client';
import { type Account } from '@/db/schema';
import { describe, expect } from 'vitest';
import { testWithDbClient } from '../__test-utils__/test-with-db-client';
import {
  createTestAccountsInDB,
  makeFakeAccount,
} from '../accounts/__test-utils__/make-fake-account';
import { makeFakeSession } from './__test-utils__/make-fake-session';
import { createSessionData } from './create-session';

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

describe('Create Session', () => {
  testWithDbClient('should create a session', async ({ dbClient }) => {
    // Setup test data
    const fakeAccount = makeFakeAccount();
    const fakeSession = makeFakeSession({ account_id: fakeAccount.id });
    await setupTestData({ dbClient, accounts: [fakeAccount] });

    // Execute the function under test
    const createdSession = await createSessionData({ dbClient, values: fakeSession });

    // Assert results
    expect(createdSession).toBeDefined();
    expect(createdSession?.id).toBeDefined();
    expect(createdSession?.refresh_token).toEqual(fakeSession.refresh_token);
    expect(createdSession?.account_id).toEqual(fakeSession.account_id);
    expect(createdSession?.created_at).toBeDefined();
    expect(createdSession?.updated_at).toBeDefined();

    // Verify in database
    const currentSessions = await dbClient.selectFrom('sessions').selectAll().execute();
    expect(currentSessions.length).toBe(1);
  });
});
