import { type DbClient } from '@/db/create-db-client';
import { type User } from '@/db/schema';
import { NotFoundError } from '@/utils/errors';
import { faker } from '@faker-js/faker';
import { describe, expect } from 'vitest';
import { testWithDbClient } from '../__test-utils__/test-with-db-client';
import { createTestUsersInDB, makeFakeUser } from './__test-utils__/make-fake-user';
import { deleteUserData } from './delete-user';

const setupTestData = async ({
  dbClient,
  users,
}: {
  dbClient: DbClient;
  users: Partial<User>[];
}) => {
  await createTestUsersInDB({ dbClient, values: users });
};

const mockUser = makeFakeUser();

describe('Delete User', () => {
  testWithDbClient('should delete a user', async ({ dbClient }) => {
    await setupTestData({ dbClient, users: [mockUser] });

    const beforeUsers = await dbClient.selectFrom('users').selectAll().execute();

    expect(beforeUsers.length).toBe(1);
    expect(beforeUsers[0]?.id).toBe(mockUser.id);

    const deletedUser = await deleteUserData({ dbClient, id: mockUser.id });
    const afterUsers = await dbClient.selectFrom('users').selectAll().execute();

    expect(afterUsers.length).toBe(0);
    expect(deletedUser?.id).toBe(mockUser.id);
  });

  testWithDbClient('should throw NotFoundError if user does not exist', async ({ dbClient }) => {
    await expect(
      deleteUserData({
        dbClient,
        id: faker.string.uuid(),
      })
    ).rejects.toThrow(new NotFoundError('User not found.'));
  });
});
