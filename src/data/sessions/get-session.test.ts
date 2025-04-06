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
  });

  testWithDbClient(
    'should throw NotFoundError if session is not existing.',
    async ({ dbClient }) => {
      expect(() =>
        getSessionData({
          dbClient,
          id: faker.string.uuid(),
        })
      ).rejects.toThrow(new NotFoundError('Session not found.'));
    }
  );
});
