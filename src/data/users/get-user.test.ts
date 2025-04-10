import { type DbClient } from '@/db/create-db-client';
import { type User } from '@/db/schema';
import { NotFoundError } from '@/utils/errors';
import { faker } from '@faker-js/faker';
import { describe, expect } from 'vitest';
import { testWithDbClient } from '../__test-utils__/test-with-db-client';
import { createTestUsersInDB, makeFakeUser } from './__test-utils__/make-fake-user';
import { getUserData } from './get-user';

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

describe('Get User', () => {
  testWithDbClient('should get a user', async ({ dbClient }) => {
    await setupTestData({ dbClient, users: [mockUser] });

    const user = await getUserData({ dbClient, id: mockUser.id });

    expect(user?.id).toBe(mockUser.id);
  });

  testWithDbClient('should throw NotFoundError if user does not exist', async ({ dbClient }) => {
    await expect(
      getUserData({
        dbClient,
        id: faker.string.uuid(),
      })
    ).rejects.toThrow(new NotFoundError('User not found.'));
  });
});
