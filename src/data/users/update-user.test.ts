import { type DbClient } from '@/db/create-db-client';
import { type User } from '@/db/schema';
import { NotFoundError } from '@/utils/errors';
import { faker } from '@faker-js/faker';
import { describe, expect } from 'vitest';
import { testWithDbClient } from '../__test-utils__/test-with-db-client';
import { createTestUsersInDB, makeFakeUser } from './__test-utils__/make-fake-user';
import { updateUserData } from './update-user';

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

describe('Update User', () => {
  testWithDbClient('should update a user', async ({ dbClient }) => {
    await setupTestData({ dbClient, users: [mockUser] });

    const beforeUsers = await dbClient.selectFrom('users').selectAll().execute();

    expect(beforeUsers.length).toBe(1);
    expect(beforeUsers[0]?.id).toBe(mockUser.id);
    expect(beforeUsers[0]?.first_name).toBe(mockUser.first_name);
    expect(beforeUsers[0]?.updated_at.toISOString()).toBe(
      (mockUser.updated_at as Date).toISOString()
    );

    const updatedFirstName = faker.person.firstName();
    const updatedUser = await updateUserData({
      dbClient,
      id: mockUser.id,
      values: { first_name: updatedFirstName },
    });
    const afterUsers = await dbClient.selectFrom('users').selectAll().execute();

    expect(afterUsers.length).toBe(1);
    expect(updatedUser?.id).toBe(mockUser.id);
    expect(updatedUser?.first_name).toBe(updatedFirstName);
    expect(updatedUser?.updated_at.toISOString()).not.equal(
      beforeUsers[0]?.updated_at.toISOString()
    );
  });

  testWithDbClient('should throw NotFoundError if user is not existing', async ({ dbClient }) => {
    await expect(
      updateUserData({
        dbClient,
        id: faker.string.uuid(),
        values: { first_name: faker.person.firstName() },
      })
    ).rejects.toThrow(new NotFoundError('User not found.'));
  });
});
