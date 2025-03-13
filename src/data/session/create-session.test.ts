import { describe, expect } from 'vitest';
import { testWithDbClient } from '../__test-utils__/test-with-db-client';
import {
  createTestAccountsInDB,
  makeFakeAccount,
} from '../accounts/__test-utils__/make-fake-account';
import { makeFakeSession } from './__test-utils__/make-fake-session';
import { createSessionData } from './create-session';

describe('Create Session', () => {
  testWithDbClient('should create a session', async ({ dbClient }) => {
    const fakeAccount = makeFakeAccount();
    const fakeSession = makeFakeSession({ account_id: fakeAccount.id });

    await createTestAccountsInDB({ dbClient, values: fakeAccount });

    const createdSession = await createSessionData({ dbClient, values: fakeSession });

    expect(createdSession).toBeDefined();
    expect(createdSession?.id).toBeDefined();
    expect(createdSession?.refresh_token).toEqual(fakeSession.refresh_token);
    expect(createdSession?.account_id).toEqual(fakeSession.account_id);
    expect(createdSession?.created_at).toBeDefined();
    expect(createdSession?.updated_at).toBeDefined();

    const currentSessions = await dbClient.selectFrom('sessions').selectAll().execute();

    expect(currentSessions.length).toBe(1);
  });
});
