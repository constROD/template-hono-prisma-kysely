import { deleteAllRecords } from '@/data/__test-utils__/delete-all-records';
import { createTestDbClient } from '@/db/create-db-client';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { createTestUserInDB } from '../__test-utils__/make-fake-user';
import { getUsersData } from './get-users';

const dbClient = createTestDbClient();

describe('Get Users', () => {
  beforeEach(async () => {
    await deleteAllRecords({ dbClient, tableName: 'users' });
  });

  afterAll(async () => {
    await deleteAllRecords({ dbClient, tableName: 'users' });
  });

  it('should get a users', async () => {
    const userCount = 10;
    const promiseArray = Array.from({ length: userCount }).map(() =>
      createTestUserInDB({ dbClient })
    );

    await Promise.all(promiseArray);

    const users = await getUsersData({ dbClient });

    expect(users.length).toBe(userCount);
  });

  it('should return empty array when no user', async () => {
    const users = await getUsersData({ dbClient });

    expect(users.length).toBe(0);
  });
});
