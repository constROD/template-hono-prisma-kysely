import { deleteAllRecords } from '@/data/__test-utils__/delete-all-records';
import { createTestDbClient } from '@/db/create-db-client';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { makeFakeUser } from '../__test-utils__/make-fake-user';
import { createUsersData } from './create-users';

const dbClient = createTestDbClient();

describe('Create User', () => {
  beforeEach(async () => {
    await deleteAllRecords({ dbClient, tableName: 'users' });
  });

  afterAll(async () => {
    await deleteAllRecords({ dbClient, tableName: 'users' });
  });

  it('should create a user', async () => {
    await deleteAllRecords({ dbClient, tableName: 'users' });
    const fakeUser = makeFakeUser();

    const [createdUser] = await createUsersData({ dbClient, values: fakeUser });

    expect(createdUser).toBeDefined();
    expect(createdUser?.id).toBeDefined();
    expect(createdUser?.email).toEqual(fakeUser.email);
    expect(createdUser?.role).toEqual(fakeUser.role);
    expect(createdUser?.created_at).toBeDefined();
    expect(createdUser?.updated_at).toBeDefined();

    const currentUsers = await dbClient.selectFrom('users').selectAll().execute();

    expect(currentUsers.length).toBe(1);
  });

  it('should create multiple users', async () => {
    await deleteAllRecords({ dbClient, tableName: 'users' });

    const userCount = 5;
    const fakeUsers = Array.from({ length: userCount }, makeFakeUser);

    const createdUsers = await createUsersData({ dbClient, values: fakeUsers });

    const currentUsers = await dbClient.selectFrom('users').selectAll().execute();

    expect(fakeUsers.length).toBe(userCount);
    expect(createdUsers.length).toBe(userCount);
    expect(currentUsers.length).toBe(userCount);
  });
});
