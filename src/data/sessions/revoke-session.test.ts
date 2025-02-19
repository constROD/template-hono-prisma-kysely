import { describe, expect } from 'vitest';
import { testWithDbClient } from '../__test-utils__/test-with-db-client';
import {
  createTestAccountsInDB,
  makeFakeAccount,
} from '../accounts/__test-utils__/make-fake-account';
import { createTestSessionsInDB, makeFakeSession } from './__test-utils__/make-fake-session';
import { revokeSessionData } from './revoke-session';

describe('Revoke Session', () => {
  testWithDbClient('should revoke a session', async ({ dbClient }) => {
    const fakeAccount = makeFakeAccount();
    const fakeSession = makeFakeSession({ account_id: fakeAccount.id });

    await createTestAccountsInDB({ dbClient, values: fakeAccount });
    await createTestSessionsInDB({ dbClient, values: fakeSession });

    const beforeSessions = await dbClient.selectFrom('sessions').selectAll().execute();

    expect(beforeSessions.length).toBe(1);
    expect(beforeSessions[0]?.id).toBe(fakeSession.id);

    const revokedSession = await revokeSessionData({ dbClient, accountId: fakeAccount.id });
    const afterSessions = await dbClient.selectFrom('sessions').selectAll().execute();

    expect(afterSessions.length).toBe(0);
    expect(revokedSession?.id).toBe(fakeSession.id);
  });
});
