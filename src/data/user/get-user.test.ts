import { deleteAllRecords } from '@/data/__test-utils__/delete-all-records';
import { createTestDbClient } from '@/db/create-db-client';
import { faker } from '@faker-js/faker';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { createTestUsersInDB } from '../__test-utils__/make-fake-user';
import { getUserData } from './get-user';

const dbClient = createTestDbClient();

describe('Get User', () => {
  beforeEach(async () => {
    await deleteAllRecords({ dbClient, tableName: 'users' });
  });

  afterAll(async () => {
    await deleteAllRecords({ dbClient, tableName: 'users' });
  });

  it('should get a user', async () => {
    const [testCreatedUser] = await createTestUsersInDB({ dbClient });

    if (!testCreatedUser) throw new Error('testCreatedUser is undefined');

    const user = await getUserData({ dbClient, id: testCreatedUser.id });

    expect(user?.id).toBe(testCreatedUser.id);
  });

  it('should return undefined when no user', async () => {
    const user = await getUserData({ dbClient, id: faker.string.uuid() });

    expect(user).toBeUndefined();
  });
});
