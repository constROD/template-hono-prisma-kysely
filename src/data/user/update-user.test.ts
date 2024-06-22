import { deleteAllRecords } from '@/data/__test-utils__/delete-all-records';
import { createTestDbClient } from '@/db/create-db-client';
import { faker } from '@faker-js/faker';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { createTestUserInDB } from '../__test-utils__/make-fake-user';
import { deleteUserData } from './delete-user';
import { updateUserData } from './update-user';

const dbClient = createTestDbClient();

describe('Update User', () => {
  beforeEach(async () => {
    await deleteAllRecords({ dbClient, tableName: 'users' });
  });

  afterAll(async () => {
    await deleteAllRecords({ dbClient, tableName: 'users' });
  });

  it('should update a user', async () => {
    const testCreatedUser = await createTestUserInDB({ dbClient });

    if (!testCreatedUser) throw new Error('testCreatedUser is undefined');

    const beforeUsers = await dbClient.selectFrom('users').selectAll().execute();

    expect(beforeUsers.length).toBe(1);
    expect(beforeUsers[0]?.id).toBe(testCreatedUser.id);
    expect(beforeUsers[0]?.first_name).toBe(testCreatedUser.first_name);

    const updatedFirstName = faker.person.firstName();
    const deletedUser = await updateUserData({
      dbClient,
      id: testCreatedUser.id,
      values: { first_name: updatedFirstName },
    });
    const afterUsers = await dbClient.selectFrom('users').selectAll().execute();

    expect(afterUsers.length).toBe(1);
    expect(deletedUser?.id).toBe(testCreatedUser.id);
    expect(deletedUser?.first_name).toBe(updatedFirstName);
  });

  it('should throw an error when updating email', async () => {
    const testCreatedUser = await createTestUserInDB({ dbClient });

    if (!testCreatedUser) throw new Error('testCreatedUser is undefined');

    expect(() =>
      updateUserData({
        dbClient,
        id: testCreatedUser.id,
        values: { email: faker.internet.email() },
      })
    ).rejects.toThrow('Cannot update email');
  });

  it('should return undefined when no user', async () => {
    const deletedUser = await deleteUserData({ dbClient, id: faker.string.uuid() });

    expect(deletedUser).toBeUndefined();
  });
});
