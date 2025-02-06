import { describe, expect } from 'vitest';
import { testWithDbClient } from '../__test-utils__/test-with-db-client';
import {
  createTestAccountsInDB,
  makeFakeAccount,
} from '../account/__test-utils__/make-fake-account';
import { createTestSessionsInDB, makeFakeSession } from './__test-utils__/make-fake-session';
import { getSessionData } from './get-session';

describe('Get Session', () => {
  testWithDbClient('should get a session', async ({ dbClient }) => {
    const fakeAccount = makeFakeAccount();
    const fakeSession = makeFakeSession({ account_id: fakeAccount.id });

    await createTestAccountsInDB({ dbClient, values: fakeAccount });

    const [testCreatedSession] = await createTestSessionsInDB({ dbClient, values: fakeSession });

    if (!testCreatedSession) throw new Error('testCreatedSession is undefined');

    const session = await getSessionData({ dbClient, id: testCreatedSession.id });

    expect(session?.id).toBe(testCreatedSession.id);
    expect(session?.account_id).toBe(fakeSession.account_id);
    expect(session?.refresh_token).toBe(fakeSession.refresh_token);
  });
});
