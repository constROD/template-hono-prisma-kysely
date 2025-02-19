import { NotFoundError } from '@/utils/errors';
import { faker } from '@faker-js/faker';
import { describe, expect } from 'vitest';
import { testWithDbClient } from '../__test-utils__/test-with-db-client';
import { createTestUsersInDB } from './__test-utils__/make-fake-user';
import { updateUserData } from './update-user';

describe('Update User', () => {
  testWithDbClient('should update a user', async ({ dbClient }) => {
    const [testCreatedUser] = await createTestUsersInDB({ dbClient });

    if (!testCreatedUser) throw new Error('testCreatedUser is undefined');

    const beforeUsers = await dbClient.selectFrom('users').selectAll().execute();

    expect(beforeUsers.length).toBe(1);
    expect(beforeUsers[0]?.id).toBe(testCreatedUser.id);
    expect(beforeUsers[0]?.first_name).toBe(testCreatedUser.first_name);
    expect(beforeUsers[0]?.updated_at.toISOString()).toBe(testCreatedUser.updated_at.toISOString());

    const updatedFirstName = faker.person.firstName();
    const updatedUser = await updateUserData({
      dbClient,
      id: testCreatedUser.id,
      values: { first_name: updatedFirstName },
    });
    const afterUsers = await dbClient.selectFrom('users').selectAll().execute();

    expect(afterUsers.length).toBe(1);
    expect(updatedUser?.id).toBe(testCreatedUser.id);
    expect(updatedUser?.first_name).toBe(updatedFirstName);
    expect(updatedUser?.updated_at.toISOString()).not.equal(
      beforeUsers[0]?.updated_at.toISOString()
    );
  });

  testWithDbClient('should throw NotFoundError if user is not existing.', async ({ dbClient }) => {
    expect(() =>
      updateUserData({
        dbClient,
        id: faker.string.uuid(),
        values: { first_name: faker.person.firstName() },
      })
    ).rejects.toThrow(new NotFoundError('User not found.'));
  });
});
