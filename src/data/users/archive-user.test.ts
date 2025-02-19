import { NotFoundError } from '@/utils/errors';
import { faker } from '@faker-js/faker';
import { describe, expect } from 'vitest';
import { testWithDbClient } from '../__test-utils__/test-with-db-client';
import { createTestUsersInDB } from './__test-utils__/make-fake-user';
import { archiveUserData } from './archive-user';

describe('Archive User', () => {
  testWithDbClient('should archive a user', async ({ dbClient }) => {
    const [testCreatedUser] = await createTestUsersInDB({ dbClient });

    if (!testCreatedUser) throw new Error('testCreatedUser is undefined');

    const beforeUsers = await dbClient.selectFrom('users').selectAll().execute();

    expect(testCreatedUser.id).toBe(beforeUsers[0]?.id);
    expect(testCreatedUser.deleted_at).toBeNull();
    expect(beforeUsers.length).toBe(1);
    expect(beforeUsers[0]?.deleted_at).toBeNull();

    const archivedUser = await archiveUserData({ dbClient, id: testCreatedUser.id });
    const afterUsers = await dbClient.selectFrom('users').selectAll().execute();

    expect(testCreatedUser?.id).toBe(afterUsers[0]?.id);
    expect(archivedUser?.id).toEqual(testCreatedUser.id);
    expect(archivedUser?.deleted_at).toBeDefined();
  });

  testWithDbClient('should throw NotFoundError if user is not existing.', async ({ dbClient }) => {
    expect(() =>
      archiveUserData({
        dbClient,
        id: faker.string.uuid(),
      })
    ).rejects.toThrow(new NotFoundError('User not found.'));
  });
});
