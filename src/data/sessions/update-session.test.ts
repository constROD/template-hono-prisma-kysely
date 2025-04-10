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
import { updateSessionData } from './update-session';

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

describe('Update Session', () => {
  testWithDbClient('should update a session', async ({ dbClient }) => {
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
    expect(beforeSessions[0]?.refresh_token).toBe(fakeSession.refresh_token);
    expect(beforeSessions[0]?.updated_at.getTime()).toBe(
      (fakeSession.updated_at as Date).getTime()
    );

    // Execute the function under test
    const updatedRefreshToken = faker.string.sample();
    const updatedSession = await updateSessionData({
      dbClient,
      id: fakeSession.id,
      values: { refresh_token: updatedRefreshToken },
    });

    // Assert results
    const afterSessions = await dbClient.selectFrom('sessions').selectAll().execute();
    expect(afterSessions.length).toBe(1);
    expect(updatedSession?.id).toBe(fakeSession.id);
    expect(updatedSession?.refresh_token).toBe(updatedRefreshToken);
    expect(updatedSession?.updated_at.getTime()).not.equal(beforeSessions[0]?.updated_at.getTime());
  });

  testWithDbClient(
    'should throw NotFoundError if session is not existing.',
    async ({ dbClient }) => {
      // Execute and assert
      expect(() =>
        updateSessionData({
          dbClient,
          id: faker.string.uuid(),
          values: { refresh_token: faker.string.sample() },
        })
      ).rejects.toThrow(new NotFoundError('Session not found.'));
    }
  );
});
