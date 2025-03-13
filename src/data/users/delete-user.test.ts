import { NotFoundError } from '@/utils/errors';
import { faker } from '@faker-js/faker';
import { describe, expect } from 'vitest';
import { testWithDbClient } from '../__test-utils__/test-with-db-client';
import { createTestUsersInDB } from './__test-utils__/make-fake-user';
import { deleteUserData } from './delete-user';

describe('Delete User', () => {
  testWithDbClient('should delete a user', async ({ dbClient }) => {
    const [testCreatedUser] = await createTestUsersInDB({ dbClient });

    if (!testCreatedUser) throw new Error('testCreatedUser is undefined');

    const beforeUsers = await dbClient.selectFrom('users').selectAll().execute();

    expect(beforeUsers.length).toBe(1);
    expect(beforeUsers[0]?.id).toBe(testCreatedUser.id);

    const deletedUser = await deleteUserData({ dbClient, id: testCreatedUser.id });
    const afterUsers = await dbClient.selectFrom('users').selectAll().execute();

    expect(afterUsers.length).toBe(0);
    expect(deletedUser?.id).toBe(testCreatedUser.id);
  });

  testWithDbClient('should throw NotFoundError if user is not existing.', async ({ dbClient }) => {
    expect(() =>
      deleteUserData({
        dbClient,
        id: faker.string.uuid(),
      })
    ).rejects.toThrow(new NotFoundError('User not found.'));
  });
});
