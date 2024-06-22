import { deleteAllRecords } from '@/data/__test-utils__/delete-all-records';
import { createTestDbClient } from '@/db/create-db-client';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { makeFakeUser } from '../__test-utils__/make-fake-user';
import { createUsersData } from './create-users';
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
    const fakeUsers = Array.from({ length: userCount }, makeFakeUser);

    const createdUsers = await createUsersData({ dbClient, values: fakeUsers });

    const users = await getUsersData({ dbClient });

    expect(users.length).toBe(createdUsers.length);
    expect(users.length).toBe(userCount);
  });

  it('should return empty array when no user', async () => {
    const users = await getUsersData({ dbClient });

    expect(users.length).toBe(0);
  });
});
